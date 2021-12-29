import Renderer from './renderer2d.js';
import Features from './features.js';

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
				console.log('Features.getFeatures', json, prefix, point);
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
		default:
			console.warn('Warning: Bad command ', data);
			break;
	}
};
