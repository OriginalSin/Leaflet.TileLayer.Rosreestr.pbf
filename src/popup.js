import L from 'leaflet';
import Utils from './popupUtils.js';

let popup;
let currNum = 0;

const setNum = (delta, features) => {
	const nextNum = currNum + delta;
	const it = features[nextNum];
	if (it) {
		currNum = nextNum;
		popup._getFeature(it.attrs.id, it.type, currNum);
	}
};

const setEvents = (pNode, features) => {
	const exportIcon = pNode.getElementsByClassName('exportIcon')[0];
	const cadRight = pNode.getElementsByClassName('cadRight')[0];
	if (cadRight) {
		L.DomEvent.on(cadRight, 'click', () => {
			setNum(1, features);
			if (exportIcon) { L.DomUtil.addClass(exportIcon, 'notVisible'); }
		});
	}
	const cadLeft = pNode.getElementsByClassName('cadLeft')[0];
	if (cadLeft) {
		L.DomEvent.on(cadLeft, 'click', () => {
			setNum(-1, features);
			if (exportIcon) { L.DomUtil.addClass(exportIcon, 'notVisible'); }
		});
	}
	const showObject = pNode.getElementsByClassName('ShowObject')[0];
	if (showObject) {
		L.DomEvent.on(showObject, 'click', () => {
			const it = features[currNum];
			popup._setBoundsView(it);
			if (exportIcon) { L.DomUtil.removeClass(exportIcon, 'notVisible'); }
		});
	}
	
};
export default {	
	getContent: (feature, nm, features) => {
		let node = L.DomUtil.create('div', 'cadInfo');
		node.innerHTML = Utils.getContent(feature, currNum, features);
		setEvents(node, features);
		return node;

	},
	getPopup: (latlng, map) => {
		currNum = 0;
		popup = L.popup({minWidth: 350, className: 'cadasterPopup'})
			.setLatLng(latlng)
			.setContent('<div class="cadInfo">Поиск информации...</div>')
			.openOn(map);
		return popup;
	}
};
