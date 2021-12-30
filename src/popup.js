import L from 'leaflet';
import Utils from './popupUtils.js';
import Config from './config.js';

let popup;
let currNum = 0;
let currGeo;
let currGeoJson;

const setNum = (delta, features) => {
	const nextNum = currNum + delta;
	const it = features[nextNum];
	if (it) {
		currNum = nextNum;
		const dm = popup._map.options.dataManager;
		dm.postMessage({
			cmd: 'feature',
			prefix: Config.pkkPrefix,
			nm: currNum,
			id: it.attrs.id,
			type: it.type
		});
	}
};
const setBoundsView = (it) => {
	const crs = L.Projection.SphericalMercator;
	const lBounds = L.latLngBounds(
		crs.unproject(L.point(it.extent.xmin, it.extent.ymin)),
		crs.unproject(L.point(it.extent.xmax, it.extent.ymax))
	);
	const map = popup._map;
	const dm = map.options.dataManager;

	const onViewreset = function() {
		const bounds = map.getPixelBounds();
		const ne = map.options.crs.project(map.unproject(bounds.getTopRight()));
		const sw = map.options.crs.project(map.unproject(bounds.getBottomLeft()));
		const ids = [0, 1 , 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		const pars = {
			size: [bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y].join(','),
			bbox: [sw.x, sw.y, ne.x, ne.y].join(','),
			layers: 'show:' + ids.join(','),
			layerDefs: '{' + ids.map((nm) => '\"' + nm + '\":\"ID = \'' + it.attrs.id + '\'"').join(',') + '}',
			format: 'png32',
			dpi: 96,
			transparent: 'true',
			imageSR: 102100,
			bboxSR: 102100
		};
		let imageUrl = Config.pkkPrefix +  'arcgis/rest/services/PKK6/';

		if (it.type === 10) { imageUrl += 'ZONESSelected'; }
		else if (it.type === 6) { imageUrl += 'ZONESSelected'; }
		else if (it.type === 7) { imageUrl += 'BordersGKNSelected'; }
		else { imageUrl += 'CadastreSelected'; }
		imageUrl += '/MapServer/export?f=image&cross=' + Math.random();
		for (var key in pars) {
			imageUrl += '&' + key + '=' + pars[key];
		}
		imageUrl = encodeURI(imageUrl);
		if (popup._overlay) {
			map.removeLayer(popup._overlay);
		}
		popup._overlay = new L.ImageOverlay(imageUrl, map.getBounds(), {opacity: 0.5, crossOrigin: '*', clickable: true})
			.on('error', (ev) => {
				let img = ev.target._image;
				console.log('ggg', img.src);
				if (img.src.indexOf('retr=1') === -1) {
					// img.src = '';
					img.src = imageUrl + '&retr=1';
				}
			})
			.on('load', (ev) => {
				const src = ev.currentTarget;
				const w = src.width, h = src.height;
				const ctx = new OffscreenCanvas(w, h).getContext('2d');
				ctx.drawImage(src, 0, 0, w, h);
				let imgData = ctx.getImageData(0, 0, w, h);
				dm.postMessage({
					cmd: 'msqr',
					pixels: imgData.data.buffer,
					width: w,
					height: h,
					channels: 4,
					it: it
				}, [imgData.data.buffer]);
			})
			.addTo(map);
	};
	map.once('moveend', () => { setTimeout(onViewreset, 350) });
	// map.once('moveend', () => { L.Util.requestAnimFrame(onViewreset)} );
	// map.once('moveend', onViewreset);
	map.fitBounds(lBounds, {reset: true});
};

const setEvents = (pNode, features) => {
	const exportIcon = pNode.getElementsByClassName('exportIcon')[0];
	if (exportIcon) {
		L.DomEvent.on(exportIcon, 'click', () => {
			exportIcon.setAttribute('download', currGeoJson.properties.attrs.id + '.geojson');
			exportIcon.setAttribute('href', window.URL.createObjectURL(new Blob([JSON.stringify(currGeoJson, null, '\t')], {type: 'text/json;charset=utf-8;'})));
		});
	}

	const cadRight = pNode.getElementsByClassName('cadRight')[0];
	if (cadRight) {
		L.DomEvent.on(cadRight, 'click', () => {
			setNum(1, features);
			if (exportIcon) { L.DomUtil.addClass(exportIcon, 'notVisible'); }
		});
	}
	const cadLeft = pNode.getElementsByClassName('cadLeft')[0];
	if (cadLeft) {
		L.DomEvent.on(cadLeft, 'click', () => {
			setNum(-1, features);
			if (exportIcon) { L.DomUtil.addClass(exportIcon, 'notVisible'); }
		});
	}
	const showObject = pNode.getElementsByClassName('ShowObject')[0];
	if (showObject) {
		L.DomEvent.on(showObject, 'click', () => {
			setBoundsView(features[currNum]);
		});
	}
};

const getContent = (feature, nm, features) => {
	let node = L.DomUtil.create('div', 'cadInfo');
	node.innerHTML = Utils.getContent(feature, currNum, features);
	setEvents(node, features);
	return node;
};
const getGeoJson = (pathPoints, it) => {
	const map = popup._map;
	var rings = pathPoints.map(function (it) {
		var ring = it.map(function (p) {
			return L.point(p.x, p.y);
		});
		ring = L.LineUtil.simplify(ring, 1);
		return ring.map(function (p) {
			return map.containerPointToLatLng(p);
		});
	});
	if (rings.length) {
		const exportIcon = popup.getContent().getElementsByClassName('exportIcon')[0];
		if (exportIcon) { L.DomUtil.removeClass(exportIcon, 'notVisible'); }

		if (map.options.clearGeoJson && currGeo && currGeo._map) {
			map.removeLayer(currGeo);
			if (popup._overlay) { map.removeLayer(popup._overlay); }
		}
		currGeo = L.polygon(rings.map(function(r) { return [r]; }));
		map.addLayer(currGeo);
		currGeoJson = currGeo.toGeoJSON();
		currGeoJson.properties = it;
		if (map.options.geoJsonDetected) { map.options.geoJsonDetected(currGeoJson); }
		return currGeoJson;
	}
};

let itemsArr;
export default {
	getDataManager: () => {
		const dataManager = L.DomUtil.create('canvas', '').transferControlToOffscreen ? new Worker("dataManager.js") : null;
		dataManager.onmessage = msg => {
			const data = msg.data;
			const {cmd, url, feature, items, coords, pcoords, prefix, point, nm} = data;
			switch(cmd) {
				case 'features':
					itemsArr = items.arr;
					if (feature) {
						popup.setContent(getContent(feature, 0, itemsArr));
					}
					break;
				case 'feature':
					popup.setContent(getContent(feature, nm, itemsArr));
					break;
				case 'tile':	// tile отрисован
					break;
				case 'msqr':
					getGeoJson(data.pathPoints, data.it);
					break;
				default:
					console.warn('Warning: Bad command ', cmd);
					break;
			}
		};
		return dataManager;
	},
	clickOnMap: (ev) => {
		const latlng = ev.latlng;
		const map = ev.target;
		currNum = 0;
		popup = L.popup({minWidth: 350, className: 'cadasterPopup'})
			.setLatLng(latlng)
			.setContent('<div class="cadInfo">Поиск информации...</div>')
			.openOn(map);
		const dm = map.options.dataManager;
		dm.postMessage({
			cmd: 'features',
			prefix: Config.pkkPrefix,
			point: latlng.lat + '+' + latlng.lng,
		});

		return popup;
	}
};
