import 'path2d-polyfill';
import {VectorTile} from '@mapbox/vector-tile';
import Protobuf from 'pbf';

export default {	
	drawPBF: (tile, url, coords, pcoords) => {
		return fetch(url)
			.then(res => {
				if (res.status === 404) {
					throw new TypeError('tile skiped: ' + url);
				}
				return res.blob();
			})
			.then(blob => blob.arrayBuffer())
			.then(buf => {
				const d = coords.z - pcoords.z;
				let scale = 1;
				let dx = 0;
				let dy = 0;
				if (d > 0) {
					scale = Math.pow(2, d);
					dx = 256 * (coords.x - pcoords.x * scale);
					dy = 256 * (coords.y - pcoords.y * scale);
				}
						// console.log('kdd', coords, pcoords, scale, dx, dy);
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
						const sc = 256 * scale / layer.extent;
						// console.log('k', k, coords, pcoords, scale, dx, dy);


						for (let i = 0; i < layer.length; ++i) {
							const vf = layer.feature(i);
							const props = vf.properties;
							const coords = vf.loadGeometry()[0];
							let p = coords.shift();
							if (vf.type === 1 && props._name.length === 2) {
								// ctx.strokeText(props._name, p.x * sc, p.y * sc);
								// points.push({pos: [p.x * sc, p.y * sc], vf});
							} else {
								path.moveTo(p.x * sc - dx, p.y * sc - dy);
								coords.forEach((p, i) => {
									path.lineTo(p.x * sc - dx, p.y * sc - dy);
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