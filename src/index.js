import './index.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PbfLayer from './TileLayer.Rosreestr.pbf.js';

window.addEventListener('load', async () => {
    const map = L.map('map', {}).setView([55.45, 37.37], 4);

    const dataManager = new Worker("dataManager.js");

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const layers = [
		new PbfLayer({
			dataManager: dataManager,
			template: 'https://pkk5.kosmosnimki.ru/arcgis/rest/services/Hosted/caddivsion/VectorTileServer/tile/{z}/{y}/{x}.pbf'
		}).addTo(map),
		new PbfLayer({
			dataManager: dataManager,
			template: 'https://pkk5.kosmosnimki.ru/arcgis/rest/services/Hosted/vt_anno_light/VectorTileServer/tile/{z}/{y}/{x}.pbf'
		}).addTo(map)
	];

	dataManager.onmessage = msg => {
		 // console.log('Main dataManager', msg.data);//, _this._tiles);
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

});