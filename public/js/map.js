mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: coordinates, // Use the pre-defined coordinates variable
    zoom: 9 // starting zoom
});

console.log("Coordinates:", coordinates);

// Add marker at the listing location
const marker = new mapboxgl.Marker()
    .setLngLat(coordinates) // Use the pre-defined coordinates variable
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML(`<h4>${listing.location}</h4>`)) // **NOTE:** 'listing' is still used here
    .addTo(map);