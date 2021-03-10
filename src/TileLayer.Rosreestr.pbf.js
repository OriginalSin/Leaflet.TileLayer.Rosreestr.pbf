import L from 'leaflet';
import {VectorTile} from '@mapbox/vector-tile';
import Protobuf from 'pbf';

export default L.GridLayer.extend({
    options: {
		maxZoom: 14
	},
    createTile: function(coords, done){
        var error;

        var tile = L.DomUtil.create('canvas', 'leaflet-tile');
        var size = this.getTileSize();
        tile.width = size.x;
        tile.height = size.y;

		var url = L.Util.template(this.options.template, coords);
		fetch(url)
			.then(res => res.blob())
			.then(blob => blob.arrayBuffer())
			.then(buf => {
				// console.log('buf', buf);
				const path = new Path2D();
				// const t = {};
				const {layers} = new VectorTile(new Protobuf(buf));								
				Object.keys(layers).forEach(k => {
					const layer = layers[k];
					const sc = 256 / layer.extent;
					for (let i = 0; i < layer.length; ++i) {
						const vf = layer.feature(i);
						if (vf.type !== 1) {
							const coordinates = vf.loadGeometry()[0];
							let p = coordinates.shift();
							path.moveTo(p.x * sc, p.y * sc);
							coordinates.forEach((p, i) => {
								path.lineTo(p.x * sc, p.y * sc);
							});
						}
					}
				});				
				return path;
			})
			.then(path => {
				const ctx = tile.getContext("2d");
				ctx.strokeStyle = 'red';
				ctx.stroke(path);
				done('', tile);
			})
			.catch(ev => {
				done('Нет данных', tile);
			});
        return tile;
    }
});