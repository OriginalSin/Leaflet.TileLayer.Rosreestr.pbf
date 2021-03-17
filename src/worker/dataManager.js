import Renderer from './renderer2d.js';
import {VectorTile} from '@mapbox/vector-tile';
import Protobuf from 'pbf';

let canvas;
let cwidth, cheight;	
let promArr;
let filters;

let abortController;

async function getBoxTiles(signal, bbox) {
	const [xmin, ymin, xmax, ymax] = bbox;
	const response = await fetch(`/box/${[xmin,ymin,xmax,ymax].map(v => v.toFixed(6)).join(',')}`, { signal });
	return response.json();
}

async function getTiles (zoom, bbox, bounds) {
	if (renderFlag) {
		console.log('отменить пред. rendering:', renderFlag, renderNum);
	}
	renderFlag = true;
	if (abortController) {
		abortController.abort();
	}
	abortController = new AbortController();	
	// const items = await getBoxTiles(abortController.signal, bbox);	
	let items = [
		//{x: 2, y: 1, z: 3},
		// {x: 5, y: 9, z: 4}
		{x: 640, y: 1239, z: 11}
	];

	promArr = items.map(({x, y, z}) => {
		return fetch(`https://pkk5.kosmosnimki.ru/arcgis/rest/services/Hosted/caddivsion/VectorTileServer/tile/${z}/${x}/${y}.pbf`)
		.then(res => res.blob())
		.then(blob => blob.arrayBuffer())
		.then(buf => {
			const t = {};
			if (renderNum === moveendNum) {
				let tm = Date.now();
				/*
				const {layers} = new VectorTile(new Protobuf(buf));
				const features = Object.keys(layers).reduce((a, k) => {
					geojson([x, y, z], layers[k])
					.forEach(feature => {
					// console.log('hhh', feature);
						const {properties: {uid}} = feature;
						a[uid] = feature;
				//		if (feature.geometry.type === "Polygon") {
				//			Renderer.render2dRing(screen, feature.geometry.coordinates[0]);
				//		}
					});
					return a;
				}, {}); 
*/
				const {layers} = new VectorTile(new Protobuf(buf));								
				Object.keys(layers).forEach(k => {
					const layer = layers[k];
					t[k] = {
						features: geojson([x, y, z], layer),
						x, y, z,
						extent: layer.extent
					};
					/*
					for (let i = 0; i < layer.length; ++i) {
						const vf = layer.feature(i);
						const properties = vf.properties;
				// if (chkFilters(properties)) {
				//if (vf.properties.uid === 192217) {
						const coordinates = vf.loadGeometry();
						const path = new Path2D();
						coordinates[0].forEach((p, i) => {
							if (i) {
								path.lineTo(p.x, p.y);
							}
							else {
								path.moveTo(p.x, p.y);
							}
						});
						t[k].features.push({type: vf.type, coordinates, properties, path});							
				// }
					}*/					
				});				
				console.log(z, x, y, renderFlag, renderNum, moveendNum, 'parse pbf tm:', Date.now() - tm);
			}
			else {
				console.log('++++ отмена parse:', z, x, y, renderNum, moveendNum);
			}
			return t;
		});
	});
	Promise.all(promArr)
	.then(tiles => {		
		if (renderNum === moveendNum) {

			const ctx = canvas.getContext("2d");
			// ctx.resetTransform();
			ctx.clearRect(0, 0, cwidth, cheight);
			let tm = Date.now();
			tiles.forEach(layers => {
				Object.keys(layers).forEach(k => {
					const {features, x, y, z, extent} = layers[k];				
					const tw = 1 << (8 + zoom - z);
					let x0 = x * tw - bounds.min.x;
					if (x0 + tw < 0) {
						x0 += Math.pow(2, z) * tw;
					}

					const y0 = y * tw - bounds.min.y;
					const sc = tw / extent;
					// console.log('offsetx:', x, y, z, extent, x0, y0, tw, sc);

					// ctx.transform(0.5, 0, 0, 0.5, 0, 220);
// ctx.lineWidth = 10;
// ctx.strokeRect(75, 140, 150, 110);
// ctx.fillRect(130, 190, 40, 60);

					ctx.save();
					ctx.resetTransform();
					ctx.beginPath();
					let region = new Path2D();
					region.rect(x0, y0, tw, tw);
					ctx.clip(region);
					ctx.transform(sc, 0, 0, sc, x0, y0);
		// ctx.strokeStyle = 'blue';
		// ctx.fillStyle = 'rgba(255, 0, 0, 0.01)';
		// ctx.fillStyle = 'rgba(255, 0, 0, 1)';

					features.forEach(feature => {
					console.log('feature:', feature);
						// if (feature.type === 3) {															
							Renderer.render2dpbf(ctx, feature.path);
						// }
					});
					ctx.restore();
				});
			});		
			console.log(renderFlag, renderNum, moveendNum, 'tm:', Date.now() - tm);
			bitmapToMain(canvas);
			console.log('transfer:', Date.now() - tm);
			renderFlag = false;
		}
		else {
			console.log('----- отмена rendering:', renderNum, moveendNum);
		}
		renderNum++;
	})
	.catch(() => {});
}
function geojson([x, y, z], layer) {
    if (!layer) return;
    const features = [];
    for (let i = 0; i < layer.length; ++i) {
        features.push (layer.feature(i).toGeoJSON(x, y, z));        
    }
    return features;
}

const getItemsByPoint = p => {
	let bounds = lastData.bounds;
	let zoom = lastData.zoom;
	return Promise.all(promArr)
	.then(tiles => {		
		const ctx = canvas.getContext("2d");
		let items = [];
		let tm = Date.now();
		tiles.forEach(layers => {
			Object.keys(layers).forEach(k => {
				const {features, x, y, z, extent} = layers[k];				
				const tw = 1 << (8 + zoom - z);
				const y0 = y * tw;
				if (p.y < y0 || p.y > y0 + tw) {
					return;
				}
				let x0 = x * tw;
				if (p.x < x0 || p.x > x0 + tw) {
					return;
				}

				const sc = tw / extent;
				const xx = (p.x - x0) / sc;
				const yy = (p.y - y0) / sc;
				features.forEach(feature => {
					if (feature.type === 3 && feature.path) {
						if (ctx.isPointInPath(feature.path, xx, yy)) {
							items.push(feature.properties);
						}
					}
				});
			});
		});
		return items.length ? items : null;
	});
}

const bitmapToMain = canvas => {
	self.postMessage({
		cmd: 'rendered'
	});
	// var imageData = canvas.transferToImageBitmap();
	// self.postMessage({
		// cmd: 'rendered',
		// bitmap: imageData
	// }, [ imageData ]);
};

addEventListener('tilesLoaded', getTiles);

function rgbToHex(r, g, b, a) {
	if (r > 255 || g > 255 || b > 255)
		throw "Invalid color component";
	return ((r << 16) | (g << 8) | b).toString(16);
}

const chkEvent = ev => {
	switch(ev.type) {
		case 'mousemove':
			let items;
			const point = ev.containerPoint;
			const ctx = canvas.getContext('2d');
			const p = ctx.getImageData(point.x, point.y, 1, 1).data;
			if (p[3]) {
				// const hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
				getItemsByPoint(ev.mapMousePos).then(items => {
					// console.log('----- mousemove:', hex, p[3], items);
					self.postMessage({
						cmd: 'mouseover',
						items: items
					});
				});
			} else {
				self.postMessage({
					cmd: 'mouseover'
				});
			}
			break;
		default:
			console.warn('Warning: Bad event ', ev);
			break;
	}
}

const setFilter = ev => {
	if (!filters) {
		filters = {};
	}
	filters[ev.type || 'common'] = ev.data;
}

const chkFilters = props => {
	// let out = false;
	const fTypes = Object.keys(filters);
	for (let key in filters) {
		for (let i = 0, len = filters[key].length; i < len; i++) {
			let opt = filters[key][i];
			let val = props[opt.key];
			if ('lt' in opt && val >= opt.lt) {
				return false;
			}
			if ('gt' in opt && val <= opt.gt) {
				return false;
			}
		}
	}
	return true;
	// if (props.uid === 192217) {
		// console.log('chkFilters ', props, filters);
		// return true;
	// } else {
		// return false;
	// }
}

const drawPBF = (tile, url) => {
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
			return false;
		});
}

let renderFlag = false;
let renderNum = 1;
let moveendNum = 0;
let lastData;
onmessage = function(evt) {    
	const data = evt.data || {};
	const {cmd, zoom, bbox, bounds, width, height, canvas, url} = data;
	switch(cmd) {
		case 'setFilter':
			setFilter(data);
			console.log('----- setFilter:', data);
			break;
		case 'event':
			chkEvent(data);
			break;
		case 'addLayer':
			canvas = data.canvas;
			break;
		case 'drawScreen':
			cwidth = width;
			cheight = height;
			//canvas = new OffscreenCanvas(width, height);
			break;
		case 'tile':
			// console.warn('dddddd ', data);
			drawPBF(canvas, url).then(flag => {
				// console.log('----- dddddd1:', flag);
				self.postMessage({
					cmd: 'tile',
					id: data.id,
					tKey: data.tKey,
					url: url,
					flag: flag
				});

			});
			// moveendNum++;
			// lastData = data;
			// getTiles(zoom, bbox, bounds);
			break;
		default:
			console.warn('Warning: Bad command ', data);
			break;
	}
};
