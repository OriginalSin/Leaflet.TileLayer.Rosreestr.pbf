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
			}).addTo(map)
	}, {
		cadGroup: L.layerGroup([
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