import './index.css';
import './cadastre.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PbfLayer from './TileLayer.Rosreestr.pbf.js';
import Popup from './popup.js';
import Config from './config.js';

window.addEventListener('load', async () => {
    const map = L.map('map', {
		clearGeoJson: true,
		geoJsonDetected: (geoJson) => {
			console.log('geoJsonDetected', geoJson);
		},
		dataManager: Popup.getDataManager()
	})
	.setView([55.64, 37.52], 18)
	.on('click', Popup.clickOnMap);

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

	const prefix = 'https://pkk.rosreestr.ru/';
	const lc = L.control.layers({
		osm: L.tileLayer(Config.tilesPrefix + 'tiles/om/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map)
	}, {
		cadGroup: L.layerGroup([
			new PbfLayer({
				// crossOrigin: '*',
				// maxNativeZoom: 11,
				maxZoom: 14,
				dataManager: map.options.dataManager,
				zoomHook: zoomHook,
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