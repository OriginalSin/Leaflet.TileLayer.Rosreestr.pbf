import './index.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PbfLayer from './TileLayer.Rosreestr.pbf.js';

window.addEventListener('load', async () => {
    const map = L.map('map', {}).setView([55.45, 37.37], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const testLayer = new PbfLayer({
        template: 'https://pkk5.kosmosnimki.ru/arcgis/rest/services/Hosted/caddivsion/VectorTileServer/tile/{z}/{y}/{x}.pbf'
    }).addTo(map);
    const testLayer1 = new PbfLayer({
        template: 'https://pkk5.kosmosnimki.ru/arcgis/rest/services/Hosted/vt_anno_light/VectorTileServer/tile/{z}/{y}/{x}.pbf'
    }).addTo(map);

});