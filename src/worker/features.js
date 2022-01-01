import Config from '../config.js';

export default {	
	getFeature: (id, type) => {
		let url = Config.pkkPrefix + 'api/features/' + type + '/' + id + '?date_format=%c&_=' + Date.now();
		return fetch(url)
			.then(res => res.json())
			.then(json => {
				return {id: id, feature: json};
			})
			.catch(err => {
				console.warn('getFeature', url, err);
				return false;
			});
	},
	getFeatures: (point) => {
		let url = Config.pkkPrefix + 'api/features/?tolerance=16&skip=0&inPoint=true&text=' + point;
		return fetch(url)
			.then(res => {
				if (res.status === 404) {
					throw new TypeError('features not found on point: ' + point);
				}
				return res.json();
			})
			.then(json => {
				return {point: point, arr: json.results};
			})
			.catch(err => {
				console.warn('getFeatures', url, err);
				return false;
			});
	}
};