/* 
 * Leaflet Location Picker v0.3.2 - 2020-04-28 
 * 
 * Copyright 2020 Stefano Cudini 
 * stefano.cudini@gmail.com 
 * https://opengeo.tech/ 
 * 
 * Licensed under the MIT license. 
 * 
 * Demo: 
 * https://opengeo.tech/maps/leaflet-locationpicker/ 
 * 
 * Source: 
 * git@github.com:stefanocudini/leaflet-locationpicker.git 
 * 
 */

(function (factory) {
    if(typeof define === 'function' && define.amd) {
    //AMD
        define(['jquery','leaflet'], factory);
    } else if(typeof module !== 'undefined') {
    // Node/CommonJS
        module.exports = factory(require('jquery','leaflet'));
    } else {
    // Browser globals
    	if(typeof window.jQuery === 'undefined')
            throw 'jQuery must be loaded first';
        if(typeof window.L === 'undefined')
            throw 'Leaflet must be loaded first';
        factory(window.jQuery, window.L);
    }
})(function(jQuery, L){

	var $ = jQuery;

	$.fn.leafletLocationPicker = function(opts, onChangeLocation) {

		var http = window.location.protocol;

		var baseClassName = 'leaflet-locpicker',
			baseLayers = {
				'OSM': http + '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
				'SAT': http + '//otile1.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png'
				//TODO add more free base layers
			};

		var optsMap = {
				zoom: 0,
				center: L.latLng([40,0]),
				zoomControl: false,
				attributionControl: false
			};

		if($.isPlainObject(opts) && $.isPlainObject(opts.map))
			optsMap = $.extend(optsMap, opts.map);

		var defaults = {
      alwaysOpen: false,
			className: baseClassName,
			location: optsMap.center,
			locationFormat: '{lat}{sep}{lng}',
			locationMarker: true,
			locationDigits: 6,
			locationSep: ',',
			position: 'topright',
			layer: 'OSM',
			height: 140,
			width: 200,
			event: 'click',
			cursorSize: '30px',
			map: optsMap,
			onChangeLocation: $.noop,
      mapContainer: ""
		};

		if($.isPlainObject(opts))
			opts = $.extend(defaults, opts);

		else if($.isFunction(opts))
			opts = $.extend(defaults, {
				onChangeLocation: opts
			});
		else
			opts = defaults;

		if($.isFunction(onChangeLocation))
			opts = $.extend(defaults, {
				onChangeLocation: onChangeLocation
			});

		function roundLocation(loc) {
			return loc ? L.latLng(
				parseFloat(loc.lat).toFixed(opts.locationDigits),
				parseFloat(loc.lng).toFixed(opts.locationDigits)
			) : loc;
		}

		function parseLocation(loc) {
			var retLoc = loc;

			switch($.type(loc)) {
				case 'string':
					var ll = loc.split(opts.locationSep);
					if(ll[0] && ll[1])
						retLoc = L.latLng(ll);
					else
						retLoc = null;
				break;
				case 'array':
					retLoc = L.latLng(loc);
				break;
				case 'object':
					var lat, lng;
					if(loc.hasOwnProperty('lat'))
						lat = loc.lat;
					else if(loc.hasOwnProperty('latitude'))
						lat = loc.latitude;

					if(loc.hasOwnProperty('lng'))
						lng = loc.lng;
					else if(loc.hasOwnProperty('lon'))
						lng = loc.lon;
					else if(loc.hasOwnProperty('longitude'))
						lng = loc.longitude;

					retLoc = L.latLng(parseFloat(lat),parseFloat(lng));
				break;
				default:
					retLoc = loc;
			}
			return roundLocation( retLoc );
		}

		function buildMap(self) {

			self.divMap = document.createElement('div');
			self.$map = $(document.createElement('div'))
				.addClass(opts.className + '-map')
				.height(opts.height)
				.width(opts.width)
				.append(self.divMap);
      //adds either as global div or specified container
      //if added to specified container add some style class
      if(opts.mapContainer && $(opts.mapContainer))
        self.$map.appendTo(opts.mapContainer)
        .addClass('map-select');
      else
        self.$map.appendTo('body');

			if(self.location)
				opts.map.center = self.location;

			if(typeof opts.layer === 'string' && baseLayers[opts.layer])
				opts.map.layers = L.tileLayer(baseLayers[opts.layer]);

			else if(opts.layer instanceof L.TileLayer ||
					opts.layer instanceof L.LayerGroup )
				opts.map.layers = opts.layer;

			else
				opts.map.layers = L.tileLayer(baseLayers.OSM);

			//leaflet map
			self.map = L.map(self.divMap, opts.map)
				.addControl( L.control.zoom({position:'bottomright'}) )
				.on(opts.event, function(e) {
					self.setLocation(e.latlng);
				});

			if(opts.activeOnMove) {
				self.map.on('move', function(e) {
					self.setLocation(e.target.getCenter());
				});
			}
			
			//only adds closeBtn if not alwaysOpen
			if(opts.alwaysOpen!==true){
				var xmap = L.control({position: 'topright'});
				xmap.onAdd = function(map) {
					var btn_holder = L.DomUtil.create('div', 'leaflet-bar');
					var btn = L.DomUtil.create('a','leaflet-control '+opts.className+'-close');
					btn.innerHTML = '&times;';
					btn_holder.appendChild(btn);
					L.DomEvent
						.on(btn, 'click', L.DomEvent.stop, self)
						.on(btn, 'click', self.closeMap, self);
					return btn_holder;
				};
				xmap.addTo(self.map);
			}

			if(opts.locationMarker)
				self.marker = buildMarker(self.location).addTo(self.map);

			return self.$map;
		}

		function buildMarker(loc) {
			var css = 'padding: 0px; margin: 0px; position: absolute; outline: 1px solid #fff; box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);';

			return L.marker( parseLocation(loc) || L.latLng(0,0), {
				icon: L.divIcon({
					className: opts.className+'-marker',
					iconAnchor: L.point(0, 0),
					html: '<div style="position: relative; top: -1px; left: -1px; padding: 0px; margin: 0px; cursor: crosshair;'+
								'width: ' + opts.cursorSize + '; height: ' + opts.cursorSize + ';">'+
							'<div style="width: 50%; height: 0px; left: -70%; border-top:  2px solid black;' + css + '"></div>'+
							'<div style="width: 50%; height: 0px; left:  30%; border-top:  2px solid black;' + css + '"></div>'+
							'<div style="width: 0px; height: 50%; top:   30%; border-left: 2px solid black;' + css + '"></div>'+
							'<div style="width: 0px; height: 50%; top:  -70%; border-left: 2px solid black;' + css + '"></div>'+
						'</div>',
				})
			});
		}

		$(this).each(function(index, input) {
		    var self = this;

		    self.$input = $(this);

		    self.locationOri = self.$input.val();

			self.onChangeLocation = function() {
				var edata = {
					latlng: self.location,
					location: self.getLocation()
				};
				self.$input.trigger($.extend(edata, {
					type: 'changeLocation'
				}));
				opts.onChangeLocation.call(self, edata);
			};

		    self.setLocation = function(loc, noSet) {
				loc = loc || defaults.location;
				self.location = parseLocation(loc);

				if(self.marker)
					self.marker.setLatLng(loc);

				if(!noSet) {
					self.$input.data('location', self.location);
					self.$input.val( self.getLocation() );
					self.onChangeLocation();
				}
		    };

		    self.getLocation = function() {
		    	return self.location ? L.Util.template(opts.locationFormat, {
		    		lat: self.location.lat,
		    		lng: self.location.lng,
		    		sep: opts.locationSep
		    	}) : self.location;
		    };

		    self.updatePosition = function() {
			    switch(opts.position) {
				    case 'bottomleft':
					    self.$map.css({
						    top: self.$input.offset().top + self.$input.height() + 6,
						    left: self.$input.offset().left
					    });
					    break;
				    case 'topright':
					    self.$map.css({
						    top: self.$input.offset().top,
						    left: self.$input.offset().left + self.$input.width() + 5
					    });
					    break;
			    }
		    };

		    self.openMap = function() {
			    self.updatePosition();
			    self.$map.show();
			    self.map.invalidateSize();
			    self.$input.trigger('show');
		    };

		    self.closeMap = function() {
			    self.$map.hide();
			    self.$input.trigger('hide');
		    };

		    self.setLocation(self.locationOri, true);

		    self.$map = buildMap(self);

		    self.$input
			    .addClass(opts.className)
			    .on('focus.'+opts.className, function(e) {
				    e.preventDefault();
				    self.openMap();
			    })
			    .on('blur.'+opts.className, function(e) {
				    e.preventDefault();
				    var p = e.relatedTarget;
				    var close = true;
				    while (p) {
					    if (p._leaflet) {
						    close = false;
						    break;
					    }
					    p = p.parentElement;
				    }
				    if(close) {
				    	setTimeout(function() {
					    	self.closeMap();
					    },100)
				    }
			    });

		    $(window).on('resize', function() {
				if (self.$map.is(':visible'))
					self.updatePosition();
		    });
        //opens map initially if alwaysOpen
        if(opts.alwaysOpen && opts.alwaysOpen===true) self.openMap();
		});

		return this;
	};

});
