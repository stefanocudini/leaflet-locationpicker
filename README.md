Leaflet Location Picker
============

[![npm version](https://badge.fury.io/js/leaflet-locationpicker.svg)](http://badge.fury.io/js/leaflet-locationpicker)

Simple location picker with Leaflet map

# Usage:

```html

<label>Insert a Geo Location 
	<input id="geoloc" type="text" value="" />
</label>

```

```javascript

$('#geoloc').leafletLocationPicker();

```

# Examples:

* [Simple](examples/simple.html)


![Image](https://raw.githubusercontent.com/stefanocudini/leaflet-locationpicker/master/images/leaflet-locationpicker.png)

# Options
| Option	  | Default  | Description                       |
| --------------- | ---------------- | ----------------------------------------- |
|className        | baseClassName    |css classname applied to widget |
|location         | optsMap.center   | initial map center |
|locationFormat   | '{lat}{sep}{lng}'| returne format of location value |
|locationMarker   | true             | render manker on map |
|locationDigits   | 6                | coordinates precision |
|locationSep      | ','              | coordinates separator|
|position         | 'topright'       | position relative to input|
|layer            | 'OSM'            | base layer on map|
|height           | 140              | height of map |
|width            | 200              | with f map|
|event            | 'click'          | event to fire location pick|
|cursorSize       | '30px'           | size of 	cross cursor |
|map              | optsMap          | custom [leflet map options](https://leafletjs.com/reference-1.6.0.html#map-option) |
|onChangeLocation | $.noop           | callback retuned location after pick from map|
|alwaysOpen       | false            | always open Maps (without close button) |
|mapContainer     | ""               ||

# Install
```
npm install --save leaflet-locationpicker

```

# Build

Therefore the deployment require **npm** installed in your system.
```bash
npm install
grunt
```

# Source

* [Github](https://github.com/stefanocudini/leaflet-locationpicker)
* [NPM](https://npmjs.org/package/leaflet-locationpicker)
