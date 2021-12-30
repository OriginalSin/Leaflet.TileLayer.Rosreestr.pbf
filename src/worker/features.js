// import 'path2d-polyfill';
// import {VectorTile} from '@mapbox/vector-tile';
// import Protobuf from 'pbf';

export default {	
	getFeature: (id, type, prefix) => {
		let url = prefix + 'api/features/' + type + '/' + id + '?date_format=%c&_=1640681662291';
		return fetch(url, { })
			.then(res => res.json())
			.then(json => {
				return {prefix: prefix, id: id, feature: json};
			});
	},
	getFeatures: (point, prefix) => {
		let url = prefix + 'api/features/?tolerance=16&skip=0&inPoint=true&text=' + point;
		return fetch(url, { })
			.then(res => {
				if (res.status === 404) {
					throw new TypeError('features not found on point: ' + point);
				}
				return res.json();
			})
			.then(json => {
				return {prefix: prefix, point: point, arr: json.results};
			})
			.catch(err => {
				console.warn('error', err);
				return false;
			});
	}
};