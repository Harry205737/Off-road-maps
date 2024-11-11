// Initialize Leaflet map
const map = L.map('map').setView([0, 0], 2);  // Start with a neutral zoomed-out view

// Handle file upload
document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const arrayBuffer = e.target.result;
            loadGeoTIFF(arrayBuffer);
        };
        reader.readAsArrayBuffer(file);
    }
});

// Load GeoTIFF onto map
function loadGeoTIFF(arrayBuffer) {
    const tiff = GeoTIFF.parse(arrayBuffer);
    const image = tiff.getImage();
    const geoTIFFLayer = L.leafletGeotiff(arrayBuffer, {
        name: "GeoTIFF Layer",
        opacity: 0.7,
        renderer: L.LeafletGeotiff.Plotty,
        pane: "overlayPane"
    });
    geoTIFFLayer.addTo(map);
    map.fitBounds(geoTIFFLayer.getBounds());
}

// Get user location and add marker
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const userMarker = L.marker([latitude, longitude]).addTo(map)
            .bindPopup("Your Location")
            .openPopup();
        map.setView([latitude, longitude], 10);
    }, () => {
        alert("Geolocation permission denied.");
    });
} else {
    alert("Geolocation is not supported by this browser.");
}
