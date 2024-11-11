// Initialize the OpenLayers map
const map = new ol.Map({
    target: 'map',
    view: new ol.View({
        center: ol.proj.fromLonLat([0, 0]),  // Set initial coordinates
        zoom: 2
    })
});

// Load and render the GeoTIFF
async function loadGeoTIFF() {
    const tiff = await GeoTIFF.fromUrl('path_to_your_large_geotiff.tif');  // Replace with your GeoTIFF URL
    const image = await tiff.getImage();
    const bbox = image.getBoundingBox();

    // Use WebGL or OpenLayers to render the image
    const rasterSource = new ol.source.ImageStatic({
        url: '',
        imageExtent: ol.proj.transformExtent(bbox, 'EPSG:4326', 'EPSG:3857'),
        projection: 'EPSG:3857',
        interpolate: false
    });

    const rasterLayer = new ol.layer.Image({
        source: rasterSource
    });

    map.addLayer(rasterLayer);
    map.getView().fit(rasterSource.getExtent());
}

// Load the GeoTIFF when the page loads
loadGeoTIFF();

// Handle geolocation and add user marker
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
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
                    fill: new ol.style.Fill({ color: 'blue' }),
                    stroke: new ol.style.Stroke({ color: 'black', width: 2 })
                })
            })
        });

        map.addLayer(vectorLayer);
        map.getView().setCenter(userLocation);
        map.getView().setZoom(10);
    }, function() {
        alert('Geolocation not available');
    });
}
