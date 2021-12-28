import 'path2d-polyfill';
import {VectorTile} from '@mapbox/vector-tile';
import Protobuf from 'pbf';

export default {	
	drawPBF: (tile, url, coords, pcoords) => {
		// return fetch(url, { mode: 'cors' })
		return fetch(url, { })
			.then(res => {
				if (res.status === 404) {
					throw new TypeError('tile skiped: ' + url);
				}
				return res.blob();
			})
			.then(blob => blob.arrayBuffer())
			.then(buf => {
				const zoom = coords.z;
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
						// console.log('layers', layers);
				Object.keys(layers).forEach(k => {
					
					let lineWidth = 0;
					let type = 0;
					let label = false;
					// else 
					if (k.indexOf('label') !== -1) { label = true; ctx.font = "16px serif"; } 
					if (k.indexOf('округа') !== -1) {
						lineWidth = 1; type = 1;
						if (zoom > 6) {
							lineWidth = 3;
							ctx.font = "18px serif";
						}
					} 
					else if (k.indexOf('районы') !== -1) { type = 2; lineWidth = zoom > 6 ? 1 : 0; } 
					else if (k.indexOf('варталы') !== -1) { type = 3; lineWidth = zoom < 11 ? 0 : 1; } 
					// else if (pcoords.z > 7 && k.indexOf('районы') !== -1) { lineWidth = 2; } 
					// else if (pcoords.z > 6 && k.indexOf('варталы') !== -1) { lineWidth = 1; } 
					if (lineWidth) {
						ctx.lineWidth = lineWidth;
						// ctx.strokeStyle = 'red';
						const layer = layers[k];
						const sc = 256 * scale / layer.extent;
						// console.log('k', k, coords, pcoords, scale, dx, dy);

						for (let i = 0; i < layer.length; ++i) {
							const vf = layer.feature(i);
							const coords = vf.loadGeometry()[0];
							let p = coords.shift();
							let tx = p.x * sc - dx;
							let ty = p.y * sc - dy;
							// const geo = vf.toGeoJSON(pcoords.x, pcoords.y, pcoords.z);
						// console.log('geo', zoom, k, geo.geometry.type, vf.type, geo.properties);
							if (zoom > 4 && zoom < 13 && vf.type === 1) {
								const props = vf.properties;
								const title = props._name;
								const cntTitle = title.split(':').length;
								// if (zoom < 9 && props._label_class === 1) { tx = 0; }
								if (zoom < 9 && type !== 1 && cntTitle === 2) { tx = 0; }
								// if (zoom < 9 && type !== 1 && props._label_class === 1) { tx = 0; }
								if (zoom >= 9 && type !== 1 && cntTitle === 1) { tx = 0; }
								if (zoom > 10 && type === 3) { tx = 0; }
								// if (zoom >= 9 && type !== 1 && props._label_class === 0) { tx = 0; }
								if (tx > 10) {
									// ctx.strokeStyle = 'blue';
									ctx.strokeText(props._name, tx - 10, ty);
								}
								// points.push({pos: [p.x * sc, p.y * sc], vf});
							// } else if (vf.type === 1 && props._name.length === 2) {
							} else if (vf.type === 2 || vf.type === 3) {
				// ctx.strokeStyle = 'red';
								path.moveTo(tx, ty);
								coords.forEach((p, i) => {
									let tx = p.x * sc - dx;
									let ty = p.y * sc - dy;
									path.lineTo(tx, ty);
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