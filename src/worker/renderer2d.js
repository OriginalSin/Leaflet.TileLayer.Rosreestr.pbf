import 'path2d-polyfill';
import {VectorTile} from '@mapbox/vector-tile';
import Protobuf from 'pbf';

export default {	
	drawPBF: (tile, url) => {
		return fetch(url)
			.then(res => {
				if (res.status === 404) {
					throw new TypeError('tile skiped: ' + url);
				}
				return res.blob();
			})
			.then(blob => blob.arrayBuffer())
			.then(buf => {
				const path = new Path2D();
				const points = [];
				const pbf = new Protobuf(buf);
				const {layers} = new VectorTile(pbf);
				const ctx = tile.getContext("2d");
				ctx.strokeStyle = 'red';
				Object.keys(layers).forEach(k => {
					let lineWidth = 0;
					if (k.indexOf('label') !== -1) { lineWidth = 0; } 
					else if (k.indexOf('округа') !== -1) { lineWidth = 1; } 
					else if (k.indexOf('районы') !== -1) { lineWidth = 4; } 
					else if (k.indexOf('кварталы') !== -1) { lineWidth = 1; } 
					if (lineWidth) {
						ctx.lineWidth = lineWidth;
						const layer = layers[k];
						const sc = 256 / layer.extent;
						// console.log('k', k, layer.length);

						for (let i = 0; i < layer.length; ++i) {
							const vf = layer.feature(i);
							const props = vf.properties;
							const coords = vf.loadGeometry()[0];
							let p = coords.shift();
							if (vf.type === 1 && props._name.length === 2) {
								// ctx.strokeText(props._name, p.x * sc, p.y * sc);
								// points.push({pos: [p.x * sc, p.y * sc], vf});
							} else {
								path.moveTo(p.x * sc, p.y * sc);
								coords.forEach((p, i) => {
									path.lineTo(p.x * sc, p.y * sc);
								});
							}
						}
						ctx.stroke(path);
					} else {
						// console.log('k', k, layers[k].length);
					}
				});				
				return true;
			})
			.catch(err => {
				// console.log('error', err);
				return false;
			});
	}
};