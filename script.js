// Initialize the OpenLayers map
const map = new ol.Map({
    target: 'map',
    view: new ol.View({
        center: ol.proj.fromLonLat([0, 0]),  // Start with a neutral zoomed-out view
        zoom: 2
    }),
    layers: []  // Start without a base layer
});

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
async function loadGeoTIFF(arrayBuffer) {
    const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();
    const bbox = image.getBoundingBox();  // Get the image bounds

    const data = await image.readRasters();
    const width = image.getWidth();
    const height = image.getHeight();

    // Convert GeoTIFF data to an OpenLayers source
    const rasterSource = new ol.source.ImageStatic({
        url: '',  // No URL since we're using data directly
        imageExtent: ol.proj.transformExtent(bbox, 'EPSG:4326', 'EPSG:3857'),  // Transform to web mercator
        projection: 'EPSG:3857',
        interpolate: false
    });

    const rasterLayer = new ol.layer.Image({
        source: rasterSource
    });

    map.addLayer(rasterLayer);
    map.getView().fit(rasterSource.getExtent());  // Fit map to the extent of the GeoTIFF
}

// Get user location and add a marker
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const userLocation = ol.proj.fromLonLat([longitude, latitude]);

        const userMarker = new ol.Feature({
            geometry: new ol.geom.Point(userLocation)
        });

        const vectorSource = new ol.source.Vector({
            features: [userMarker]
        });

        const vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 6,
                    fill: new ol.style.Fill({ color: 'red' }),
                    stroke: new ol.style.Stroke({ color: 'black', width: 2 })
                })
            })
        });

        map.addLayer(vectorLayer);
        map.getView().setCenter(userLocation);
        map.getView().setZoom(10);
    }, () => {
        alert("Geolocation permission denied.");
    });
} else {
    alert("Geolocation is not supported by this browser.");
}
