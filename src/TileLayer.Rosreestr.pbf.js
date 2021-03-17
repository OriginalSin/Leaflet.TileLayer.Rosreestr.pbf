import L from 'leaflet';
import {VectorTile} from '@mapbox/vector-tile';
import Protobuf from 'pbf';
import 'whatwg-fetch';
import Renderer from './worker/renderer2d.js';

export default L.GridLayer.extend({
    options: {
		//maxZoom: 14
	},
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

			// done('', tile);
		} else {
			const layer = this;
			Renderer.drawPBF(tile, url).then(flag => {
				L.Util.requestAnimFrame(L.Util.bind(layer._tileReady, layer, coords, null, tile));
			});
			/*
			fetch(url, { mode: 'cors', credentials: 'include' })
				.then(res => res.blob())
				.then(blob => blob.arrayBuffer())
				.then(buf => {
					// console.log('buf', buf);
					const path = new Path2D();
					const points = [];
					const {layers} = new VectorTile(new Protobuf(buf));								
					// console.log('layers', layers);
					Object.keys(layers).forEach(k => {
						const layer = layers[k];
						const sc = 256 / layer.extent;
						for (let i = 0; i < layer.length; ++i) {
							const vf = layer.feature(i);
							const coords = vf.loadGeometry()[0];
							let p = coords.shift();
							if (vf.type === 1) {
								// points.push({pos: [p.x * sc, p.y * sc], vf});
							} else {
								// const coordinates = coords[0];
								path.moveTo(p.x * sc, p.y * sc);
								coords.forEach((p, i) => {
									path.lineTo(p.x * sc, p.y * sc);
								});
							}
						}
					});				
					return {points, path};
				})
				.then(data => {
					const {points, path} = data;
					// console.log('vf', points, path);
					const ctx = tile.getContext("2d");
					ctx.strokeStyle = 'red';
					ctx.stroke(path);
					// points.forEach(it => {
						// ctx.strokeText(it.vf.properties._name, it.pos[0], it.pos[1]);
					// });
					done('', tile);
				})
				.catch(ev => {
					done('Нет данных', tile);
				});
				*/
		}
        return tile;
    }
});