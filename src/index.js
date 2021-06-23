import './index.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PbfLayer from './TileLayer.Rosreestr.pbf.js';

window.addEventListener('load', async () => {
    const map = L.map('map', {}).setView([55.45, 37.37], 4);

	// const dataManager = L.DomUtil.create('canvas', '').transferControlToOffscreen ? new Worker("dataManager.js") : null;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

	const zoomHook = function(coords) {
		var tp = {
			z: coords.z,
			x: coords.x,
			y: coords.y
		};
		var d = tp.z - 12;
		if (d > 0) {
			tp.z = 12;
			tp.scale = Math.pow(2, d);
			tp.x = Math.floor(tp.x / tp.scale);
			tp.y = Math.floor(tp.y / tp.scale);
		}
		// console.log('ddd', coords, tp);
		return tp;
	};

	// const prefix = 'https://pkk5.kosmosnimki.ru/';
	const prefix = 'https://pkk.rosreestr.ru/';
	const cadGroup = L.layerGroup([
		new PbfLayer({
			zoomHook: zoomHook,
			template: prefix + 'arcgis/rest/services/Hosted/caddivsion/VectorTileServer/tile/{z}/{y}/{x}.pbf?sw=2'
		}),
		L.tileLayer.wms(prefix + 'arcgis/rest/services/PKK6/CadastreObjects/MapServer/export', {
			attribution: "ПКК © Росреестр",
			tileSize: 1024,
			layers:"show:30,27,24,23,22",
			format:"PNG32",
			"imageSR": 102100,
			bboxSR: 102100,
			f:"image",
			transparent: true,
			size:"1024,1024",
			maxZoom: 22,
			minZoom: 14,
			// clickable:true
		})
	]);
	const lc = L.control.layers({
		osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?sw=1', {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map)
	}, {
		cadGroup: cadGroup
		// ,
		// caddivsion: new PbfLayer({
			// dataManager: dataManager,
			// zoomOffset: 2,
			// zoomHook: zoomHook,
			// template: prefix + 'arcgis/rest/services/Hosted/caddivsion/VectorTileServer/tile/{z}/{y}/{x}.pbf?sw=2'
		// }),
		// vt_anno_light: new PbfLayer({
			// dataManager: dataManager,
			// minZoom: 3,
			// template: prefix + 'arcgis/rest/services/Hosted/vt_anno_light/VectorTileServer/tile/{z}/{y}/{x}.pbf?sw=1'
		// }),
		// wms: L.tileLayer.wms(prefix + 'arcgis/rest/services/PKK6/CadastreObjects/MapServer/export', {
			// attribution: "ПКК © Росреестр",
			// tileSize: 1024,
			// layers:"show:30,27,24,23,22",
			// format:"PNG32",
			// "imageSR": 102100,
			// bboxSR: 102100,
			// f:"image",
			// transparent: true,
			// size:"1024,1024",
			// maxZoom: 22,
			// minZoom: 14,
			// clickable:true
		// })
	}).addTo(map);
    // const layers = [
		// new PbfLayer({
			// dataManager: dataManager,
			// maxZoom: 11,
			// template: prefix + 'arcgis/rest/services/Hosted/caddivsion/VectorTileServer/tile/{z}/{y}/{x}.pbf?sw=1'
		// }).addTo(map)
		// ,
		// new PbfLayer({
			// dataManager: dataManager,
			// minZoom: 12,
			// template: prefix + 'arcgis/rest/services/Hosted/vt_anno_light/VectorTileServer/tile/{z}/{y}/{x}.pbf?sw=1'
		// }).addTo(map)
	// ];
//https://pkk.rosreestr.ru/arcgis/rest/services/Hosted/caddivsion/VectorTileServer/tile/5/10/19.pbf
/*
	if (dataManager) {
		dataManager.onmessage = msg => {
			 console.log('Main dataManager', msg.data);//, _this._tiles);
			const data = msg.data || {};
			const {cmd, id, tKey, items} = data;
			const layer = map._layers[id];
			switch(cmd) {
				case 'tile':
					if (layer && layer._tiles[tKey]) {
						const tile = layer._tiles[tKey];
						
					// }
					// const layer = _this._tiles[tKey];
					// const tile = _this._tiles[tKey];
					// if (id === _this._leaflet_id && tile) {
						L.Util.requestAnimFrame(L.Util.bind(layer._tileReady, layer, tile.coords, null, tile.el));
					} else {
						console.log('Tile not', msg.data, layer._leaflet_id);
						
					}
					// if (data.url === url1) {
						// done(data.flag ? '' : 'Нет данных', tile1);
					// }
					break;
				default:
					console.warn('Warning: Bad message from worker ', data);
					break;
			}

		};
	}
*/
});