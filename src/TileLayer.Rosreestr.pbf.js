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

		var url = L.Util.template(this.options.template, coords);
		var dataManager = this.options.dataManager;
		if (dataManager && tile.transferControlToOffscreen) {
			const offscreen = tile.transferControlToOffscreen();

			this.options.dataManager.postMessage({
				cmd: 'tile',
				id: this.options.layerID || this._leaflet_id,
				canvas: offscreen,
				url: url,
				tKey: this._tileCoordsToKey(coords)
			}, [offscreen]);
			L.Util.requestAnimFrame(L.Util.bind(this._tileReady, this, coords, null, tile));
		} else {
			const layer = this;
			Renderer.drawPBF(tile, url).then(flag => {
				L.Util.requestAnimFrame(L.Util.bind(layer._tileReady, layer, coords, null, tile));
			});
		}
        return tile;
    }
});