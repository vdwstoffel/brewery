"use strict";

mapboxgl.accessToken = mapBoxToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: breweryLocation.coordinates, // starting position [lng, lat]
  zoom: 15, // starting zoom
  projection: "globe", // display the map as a 3D globe
});

const marker1 = new mapboxgl.Marker()
.setLngLat(breweryLocation.coordinates)
.addTo(map);

map.on("style.load", () => {
  map.setFog({}); // Set the default atmosphere style
});

// console.log(breweryLocation)



