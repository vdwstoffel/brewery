"use strict";

mapboxgl.accessToken = mapBoxToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: breweryGeometry.coordinates, // starting position [lng, lat]
  zoom: 12, // starting zoom
  projection: "globe", // display the map as a 3D globe
});

const marker1 = new mapboxgl.Marker()
.setLngLat(breweryGeometry.coordinates)
.addTo(map);

map.on("style.load", () => {
  map.setFog({}); // Set the default atmosphere style
});