import Renderer from './renderer2d.js';
import Features from './features.js';
import Msqr from './msqr.js';

const getFeature = (it, out) => {
	Features.getFeature(it.attrs.id, it.type).then(json => {
		if (json) {
			out.feature = json.feature.feature;
			self.postMessage(out);
		}
	});
};
onmessage = function(evt) {
	const data = evt.data || {};
	const {cmd, zoom, bbox, bounds, width, height, canvas, url, coords, pcoords, point, nm, id, type} = data;
	switch(cmd) {
		case 'tile':
			Renderer.drawPBF(canvas, url, coords, pcoords).then(flag => {
				self.postMessage({ cmd: 'tile', id: data.id, tKey: data.tKey, coords: coords, url: url, flag: flag });
			});
			break;
		case 'feature':
			getFeature({ type: type, attrs: { id: id }}, { cmd: cmd, nm: nm, id: id, type: type });
			break;
		case 'features':
			Features.getFeatures(point).then(json => {
				// console.log('Features.getFeatures', json, prefix);
				if (json) {
					let out = { cmd: 'features', point: point, items: json };
					if (json.arr.length) {
						getFeature(json.arr[0], out);
					} else {
						self.postMessage(out);
					}
				}
			});
			break;
		case 'msqr':
			let pathPoints = Msqr.MSQR(data.pixels, {
				path2D: false,
				maxShapes: 5,
				width: data.width,
				height: data.height,
			});
			self.postMessage({ cmd: 'msqr', it: data.it, pathPoints: pathPoints });
			break;
		default:
			console.warn('Warning: Bad command ', data);
			break;
	}
};
