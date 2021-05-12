import L from 'leaflet';
// import {VectorTile} from '@mapbox/vector-tile';
// import Protobuf from 'pbf';
import 'whatwg-fetch';
import Renderer from './worker/renderer2d.js';

export default L.GridLayer.extend({
    createTile: function(coords, done){
        var error;

        var tile = L.DomUtil.create('canvas', 'leaflet-tile');
        var size = this.getTileSize();
        tile.width = size.x;
        tile.height = size.y;

        let pcoords = this.options.zoomHook ? this.options.zoomHook(coords) : coords;
		// if (this.options.zoomHook)
		// var url = this.getTileUrl(coords);
		var url = L.Util.template(this.options.template, pcoords);
		// if (pcoords.z === 12 && pcoords.y === 1274 && pcoords.x === 2585) {
			// url = './2585.pbf';
		var dataManager = this.options.dataManager;
		if (dataManager && tile.transferControlToOffscreen) {
		// if (false && dataManager && tile.transferControlToOffscreen) {
			const offscreen = tile.transferControlToOffscreen();

			this.options.dataManager.postMessage({
				cmd: 'tile',
				id: this.options.layerID || this._leaflet_id,
				canvas: offscreen,
				url: url,
				coords: coords,
				pcoords: pcoords,
				tKey: this._tileCoordsToKey(coords)
			}, [offscreen]);
			L.Util.requestAnimFrame(L.Util.bind(this._tileReady, this, coords, null, tile));
		} else {
			const layer = this;
			Renderer.drawPBF(tile, url, coords, pcoords).then(flag => {
				L.Util.requestAnimFrame(L.Util.bind(layer._tileReady, layer, coords, null, tile));
			});
		}
		// } else {
			// L.Util.requestAnimFrame(L.Util.bind(this._tileReady, this, coords, null, tile));
		// } 
        return tile;
    }
});