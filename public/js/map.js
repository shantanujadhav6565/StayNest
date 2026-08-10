console.log("Map JS Loaded");

// =========================================================
// CHECK VARIABLES
// =========================================================

if (typeof coordinates === "undefined") {
    console.error("Coordinates not found");
}

if (typeof mapToken === "undefined") {
    console.error("Map Token not found");
}

if (typeof listingTitle === "undefined") {
    console.error("Listing title not found");
}

// =========================================================
// MAPTILER API KEY
// =========================================================

maptilersdk.config.apiKey = mapToken;

// =========================================================
// CREATE MAP
// =========================================================

const map = new maptilersdk.Map({
    container: "map",
    style: maptilersdk.MapStyle.HYBRID,
    center: coordinates,
    zoom: 10,
});

// =========================================================
// MAP CONTROLS
// =========================================================

// Zoom + Compass
map.addControl(
    new maptilersdk.NavigationControl(),
    "top-right"
);

// Fullscreen
map.addControl(
    new maptilersdk.FullscreenControl(),
    "top-right"
);

// Current Location
map.addControl(
    new maptilersdk.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true,
        },
        trackUserLocation: true,
    }),
    "top-right"
);

// =========================================================
// POPUP
// =========================================================

const popup = new maptilersdk.Popup({
    offset: 25,
}).setHTML(`
    <div>
        <h5>${listingTitle}</h5>
        <p>📍 Property Location</p>
    </div>
`);

// =========================================================
// MARKER
// =========================================================

const marker = new maptilersdk.Marker({
    color: "red",
})
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);

// =========================================================
// CHANGE MAP STYLE
// =========================================================

function changeStyle(style) {

    switch (style) {

        case "streets":
            map.setStyle(maptilersdk.MapStyle.STREETS);
            break;

        case "satellite":
            map.setStyle(maptilersdk.MapStyle.SATELLITE);
            break;

        case "hybrid":
            map.setStyle(maptilersdk.MapStyle.HYBRID);
            break;

        case "outdoor":
            map.setStyle(maptilersdk.MapStyle.OUTDOOR);
            break;

        case "bright":
            map.setStyle(maptilersdk.MapStyle.BRIGHT);
            break;

        case "basic":
            map.setStyle(maptilersdk.MapStyle.BASIC);
            break;

        default:
            map.setStyle(maptilersdk.MapStyle.HYBRID);
    }
}

// =========================================================
// DEBUG
// =========================================================

console.log("Coordinates:", coordinates);
console.log("Map Token:", mapToken);
console.log("Listing:", listingTitle);