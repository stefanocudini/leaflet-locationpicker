/* 
 * Leaflet Location Picker v0.1.0 - 2015-07-26 
 * 
 * Copyright 2015 Stefano Cudini 
 * stefano.cudini@gmail.com 
 * http://labs.easyblog.it/ 
 * 
 * Licensed under the MIT license. 
 * 
 * Demo: 
 * http://labs.easyblog.it/maps/leaflet-locationpicker/ 
 * 
 * Source: 
 * git@github.com:stefanocudini/leaflet-locationpicker.git 
 * 
 */
/*
TODO
(function(factory){
    if (typeof define === "function" && define.amd) {
        define(['jquery','leaflet'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'), require('leaflet'));
    } else {
        factory(jQuery, L);
    }
}*/
(function(jQuery, L){

	var $ = jQuery;

	$.fn.leafletLocationPicker = function(opts, callback) {

		var baseClassName = 'leaflet-locpicker',
			baseLayers = {
				'OSM': 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				//TODO add more free base layers
			};

		var optsMap = {
			zoom: 3,			
			center: L.latLng([41.8,12.5]),
			zoomControl: false,
			attributionControl: false
		};

		if($.isPlainObject(opts) && $.isPlainObject(opts.map))
			optsMap = $.extend(optsMap, opts.map);

		var defaults = {
			title: 'Pick a Location',
			className: baseClassName,
			classNameActive: baseClassName+'-active',
			locationSep: ',',
			locationDigits: 4,
			locationFormat: '{lat}{sep}{lng}',	
			height: 120,
			width: 180,
			layer: 'OSM',
			zoom: optsMap.zoom,
			location: optsMap.center,
			map: optsMap
		};

		opts = $.extend(defaults, opts);

		function uniqueId() {
			return (Math.random().toString(36).substring(7) + Date.now()).toLocaleLowerCase();
		}

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
/*				case 'array':
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
				break;*/
				default:
					retLoc = loc;		
			}
			return roundLocation( retLoc );
		}

		function buildMap(self) {

			var divMap = document.createElement('div'),
				id = opts.className +'-'+ uniqueId();

			//div wrapper
			self.$map = $(document.createElement('div'), {
				id: id
			})
			.addClass(opts.className + '-map')
			.height(opts.height)
			.width(opts.width)
			.append(divMap)
			.appendTo('body');

			if(self.location)
				opts.map.center = self.location;

			//leaflet map
			self.map = L.map(divMap, opts.map)
				.addControl(L.control.zoom({position:'bottomright'}))
				.on('click', function(e) {
					self.setLocation(e.latlng);
				})
				.on('move', function(e) {
					self.setLocation(e.target.getCenter());
				})
				.addLayer( L.tileLayer(baseLayers[opts.layer]) );

			var xmap = L.control({position:'topright'});
			xmap.onAdd = function(map) {
				var btn = L.DomUtil.create('div','leaflet-control '+opts.className+'-close');
				btn.innerHTML = '&times;';
				L.DomEvent
					.on(btn, 'click', L.DomEvent.stop, self)
					.on(btn, 'click', self.closeMap, self);

				return btn;
			};
			xmap.addTo(self.map);

			return self.$map;
		}

		$(this).each(function(idx, input) {
		    var self = this;

		    self.$input = $(input);
		    self.locationOri = self.$input.val();

		    self.setLocation = function(loc) {
		    	self.location = parseLocation(loc);
		    	self.$input.data('location', self.location);
		    	self.$input.val( self.getLocation() );
		    };

		    self.getLocation = function() {
		    	return self.location ? L.Util.template(opts.locationFormat, {
		    		lat: self.location.lat,
		    		lng: self.location.lng,
		    		sep: opts.locationSep
		    	}) : self.location;
		    };

		    self.openMap = function() {
				self.$map.css({
			    	top: self.$input.offset().top,
			    	left: self.$input.offset().left + self.$input.width() + 5
			    }).show();
				self.map.invalidateSize();
			};

		    self.closeMap = function() {
		    	//TODO fire event on close
				self.$map.hide();
		    };

			self.setLocation( self.locationOri );

		    self.$map = buildMap(self);

		    self.$input
		    .addClass(opts.className)
		    .on('focus.'+opts.className, function(e) {
		        e.preventDefault();
		        self.openMap();
		    });
/*		    .on('blur.'+opts.className, function(e) {
		        e.preventDefault();
		        console.log(e.originalEvent.relatedTarget);
				//if(!self.$map.contains(e.originalEvent.relatedTarget))
				//	self.closeMap();
			});*/

			/*
			TODO AUTOHIDE MAP
			function resetInput() {
			    self.$input.val(self.locationOri).removeClass(opts.classNameActive).removeData('location');
			}
			self.$map
			.addClass(opts.classNameActive)
			.on('mouseout.confirm', function() {
			    self.timeoToken = setTimeout(resetInput, opts.timeout);
			})
			.on('mouseover.confirm', function() {
			    clearTimeout(self.timeoToken);
			});*/
		});

		return this;
	};

})(jQuery, L);
