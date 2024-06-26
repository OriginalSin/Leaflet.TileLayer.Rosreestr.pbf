L.Control.Search = L.Control.extend({
    options: {
        position: 'topleft',
        notHide: true,
        id: 'search'
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'search');
        var input = L.DomUtil.create('input', '', container);
        var icon = L.DomUtil.create('i', '', container);
        this._container = container;
        if (this.options.notHide) { container._notHide = true; }
        container.id = this.options.id;
        // var url = '//scanex.ru/' + (L.gmxLocale && L.gmxLocale.getLanguage() === 'rus' ? '' : 'en/');

        // container.setAttribute('href', url);
        // container.setAttribute('target', '_blank');

        // this._logoPrefix = 'leaflet-gmx-logo' + (this.options.type ? '-' + this.options.type : '');
        // var shiftClass = this._logoPrefix + '-shift';
        // this._shift = false;
        // this._updatePosition = function (ev) {
            // if (container.parentNode) {
                // var shift = (container.clientWidth - container.parentNode.clientWidth) / 2 + ev.locationSize > 0 ? true : false;
                // if (this._shift !== shift) {
                    // this._shift = shift;
                    // if (shift) {
                        // L.DomUtil.addClass(container, shiftClass);
                    // } else {
                        // L.DomUtil.removeClass(container, shiftClass);
                    // }
                // }
            // }
        // };
        // map.fire('controladd', this);
        // if (map.gmxControlsManager) {
            // map.gmxControlsManager.add(this);
        // }
        return container;
    },

    onRemove: function (map) {
        if (map.gmxControlsManager) {
            map.gmxControlsManager.remove(this);
        }
        map.fire('controlremove', this);
        map.off('onChangeLocationSize', this._updatePosition, this);
    }
});

L.Control.search = L.Control.Search;
L.control.search = function (options) {
  return new L.Control.Search(options);
};

