import 'blob-polyfill';
import 'path2d-polyfill';
import {VectorTile} from '@mapbox/vector-tile';
import Protobuf from 'pbf';

export default {	
	drawPBF: (tile, url) => {
		return fetch(url)
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
				return true;
			})
			.catch(ev => {
				console.log('error', ev);
				return false;
			});
	}
/*

,

	render2dpbf: (ctx, path2d) => {
		//ctx.beginPath();
		ctx.strokeStyle = 'blue';
		ctx.fillStyle = 'rgba(255, 0, 0, 1)';
		ctx.fill(path2d);
		ctx.stroke(path2d);
		return true;
	},
	render2d: (options, coords) => {
		const {scale, canvas} = options;        
		const ctx = canvas.getContext("2d");
		// console.log('coords', coords);
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.fillStyle = 'red';
		// ctx.moveTo(coords[0], coords[1]);
		ctx.arc(coords[0], coords[1], 14 / (2 * scale), 0, 2 * Math.PI);
		// ctx.arc(155, 166, 14, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
		return true;
	},
*/
};