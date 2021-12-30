import Renderer from './renderer2d.js';
import Features from './features.js';
import Msqr from './msqr.js';

const getFeature = (it, out) => {
	Features.getFeature(it.attrs.id, it.type, out.prefix).then(json1 => {
		out.feature = json1.feature.feature;
		self.postMessage(out);
	});
};
onmessage = function(evt) {
	const data = evt.data || {};
	const {cmd, zoom, bbox, bounds, width, height, canvas, url, coords, pcoords, prefix, point, nm, id, type} = data;
	switch(cmd) {
		case 'tile':
			Renderer.drawPBF(canvas, url, coords, pcoords).then(flag => {
				self.postMessage({
					cmd: 'tile',
					id: data.id,
					tKey: data.tKey,
					coords: coords,
					url: url,
					flag: flag
				});
			});
			break;
		case 'feature':
			let out = {
				cmd: cmd,
				prefix: prefix,
				nm: nm,
				id: id,
				type: type,
				// point: point,
				// items: json,
				// id: data.id,
				// url: url,
				// flag: flag
			};
			getFeature({
				type: type,
				attrs: {
					id: id,
				}
			}, out);
			break;
		case 'features':
			Features.getFeatures(point, prefix).then(json => {
				// console.log('Features.getFeatures', json, prefix, point);
				let out = {
					cmd: 'features',
					prefix: prefix,
					point: point,
					items: json,
					// id: data.id,
					// url: url,
					// flag: flag
				};
				if (json.arr.length) {
					getFeature(json.arr[0], out);
					// const it = json.arr[0];
					// Features.getFeature(it.attrs.id, it.type, prefix).then(json1 => {
						// out.feature = json1.feature;
						// self.postMessage(out);
					// });
				} else {
					self.postMessage(out);
				}
			});
			break;
		case 'msqr':
			let pathPoints = Msqr.MSQR(data.pixels, {
				path2D: false,
				maxShapes: 5,
				width: data.width,
				height: data.height,
				// startPoint: point,
				// filterType: filterType,
				// alpha: 150,
				// padding: attr.padding || 2,
				// alignWeight: attr.alignWeight || 1.5,
				// tolerance: 0,
				// tolerance: [0.7, 1.5],
				// align: true,
			});
			self.postMessage( {
				cmd: 'msqr',
				it: data.it,
				pathPoints: pathPoints
			});
			break;
		default:
			console.warn('Warning: Bad command ', data);
			break;
	}
};
