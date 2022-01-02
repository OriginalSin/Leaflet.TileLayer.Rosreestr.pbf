window.addEventListener('load', async () => {
	const Config = {
		pkkPrefix: 'https://pkk.rosreestr.ru/',
		tilesPrefix: 'https://sveltejs.ru/',
	};

    const map = L.map('map', {
		clearGeoJson: true,
		geoJsonDetected: (geoJson) => {
			console.log('geoJsonDetected', geoJson);
		},
		dataManager: Rosreestr.Popup.getDataManager()
	})
	.setView([55.64, 37.52], 18)
	.on('click', Rosreestr.Popup.clickOnMap);

	const prefix = 'https://pkk.rosreestr.ru/';
	const lc = L.control.layers({
		osm: L.tileLayer(Config.tilesPrefix + 'tiles/om/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map),
		'Снимки(Яндекс)': L.tileLayer.Mercator(Config.tilesPrefix + 'tiles/ys/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="https://n.maps.yandex.ru/?oid=1900133#!/?z=18&ll=36.860478%2C55.429679&l=nk%23map">Yandex</a> contributors'
			})
	}, {
		'Россрестр': L.layerGroup([
			new Rosreestr.PbfLayer({
				// crossOrigin: '*',
				// maxNativeZoom: 11,
				maxZoom: 14,
				dataManager: map.options.dataManager,
				// zoomHook: false,
				template: Config.tilesPrefix + 'tiles/pkk/{z}/{y}/{x}.pbf',
				// template: prefix + 'arcgis/rest/services/Hosted/caddivsion/VectorTileServer/tile/{z}/{y}/{x}.pbf?sw=2'
			})
			,
			/*
			new PbfLayer({
				// zoomHook: zoomHook,
				maxZoom: 22,
				minZoom: 11,
				template: prefix + 'arcgis/rest/services/Hosted/vt_anno_light/VectorTileServer/tile/{z}/{y}/{x}.pbf?sw=2'
			})
			,
			new PbfLayer({
				zoomHook: zoomHook,
				template: prefix + 'arcgis/rest/services/Hosted/BASEMAP_OSM/VectorTileServer/tile/{z}/{y}/{x}.pbf?sw=2'
			})

			,
			*/
			L.tileLayer.wms(Config.pkkPrefix + 'arcgis/rest/services/PKK6/CadastreObjects/MapServer/export', {
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
				minZoom: 15,
				// clickable:true
			})
		])
		.on('remove',	() => { map._container.style.cursor = '';	})
		.on('add',		() => { map._container.style.cursor = 'help'; })
	}).addTo(map);
});
var Mercator = L.TileLayer.extend({
	options: {
		tilesCRS: L.CRS.EPSG3395,
	},
	_getTiledPixelBounds: function(center) {
		var pb = L.TileLayer.prototype._getTiledPixelBounds.call(this, center);
		this._shiftY = this._getShiftY(this._tileZoom);
		pb.min.y += this._shiftY;
		pb.max.y += this._shiftY;

		for (var key in this._tiles) {
			var t = this._tiles[key];
			L.DomUtil.setPosition(t.el, this._getTilePos(t.coords));
		}

		return pb;
	},

	_getTilePos: function(coords) {
		return L.TileLayer.prototype._getTilePos.call(this, coords).subtract([0, this._shiftY]);
	},

	_getShiftY: function(zoom) {
		var map = this._map,
			pos = map.getCenter(),
			shift = map.options.crs.project(pos).y - this.options.tilesCRS.project(pos).y;

		return Math.floor(L.CRS.scale(zoom) * shift / 40075016.685578496);
	},
})
L.TileLayer.Mercator = Mercator;
L.tileLayer.Mercator = function(url, options) {
	return new Mercator(url, options)
}