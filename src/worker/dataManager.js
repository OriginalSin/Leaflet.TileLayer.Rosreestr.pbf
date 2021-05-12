import Renderer from './renderer2d.js';
onmessage = function(evt) {    
	const data = evt.data || {};
	const {cmd, zoom, bbox, bounds, width, height, canvas, url, coords, pcoords} = data;
	switch(cmd) {
		case 'tile':
			Renderer.drawPBF(canvas, url, coords, pcoords).then(flag => {
				self.postMessage({
					cmd: 'tile',
					id: data.id,
					tKey: data.tKey,
					url: url,
					flag: flag
				});
			});
			break;
		default:
			console.warn('Warning: Bad command ', data);
			break;
	}
};
