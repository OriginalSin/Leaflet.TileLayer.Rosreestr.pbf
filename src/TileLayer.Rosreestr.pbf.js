import L from 'leaflet';
import Renderer from './worker/renderer2d.js';

export default L.GridLayer.extend({
    options: {
		zoomHook: function(coords) {
			let tp = Object.assign({}, coords);
			let d = tp.z - 12;
			if (d > 0) {
				tp.z = 12;
				tp.scale = Math.pow(2, d);
				tp.x = Math.floor(tp.x / tp.scale);
				tp.y = Math.floor(tp.y / tp.scale);
			}
			return tp;
		}
	},
    createTile: function(coords, done) {
        let tile = L.DomUtil.create('canvas', 'leaflet-tile');
        let size = this.getTileSize();
        tile.width = size.x; tile.height = size.y;

        let pcoords = this.options.zoomHook ? this.options.zoomHook(coords) : coords;
		let url = L.Util.template(this.options.template, pcoords);
		let dataManager = this.options.dataManager;
		if (dataManager && tile.transferControlToOffscreen) {
			const offscreen = tile.transferControlToOffscreen();
			dataManager.postMessage({
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
			// const layer = this;
			Renderer.drawPBF(tile, url, coords, pcoords).then(flag => {
				L.Util.requestAnimFrame(L.Util.bind(this._tileReady, this, coords, null, tile));
			});
		}
        return tile;
    }
});