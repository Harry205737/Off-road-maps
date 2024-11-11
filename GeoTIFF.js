async function loadGeoTIFFAsImage() {
    const tiff = await GeoTIFF.fromUrl('path_to_your_large_geotiff.tif');
    const image = await tiff.getImage();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const width = image.getWidth();
    const height = image.getHeight();
    canvas.width = width;
    canvas.height = height;

    const rasterData = await image.readRasters();

    // Use canvas to draw the image (this can be optimized for memory)
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(rasterData[0]);
    ctx.putImageData(imageData, 0, 0);

    // Add the canvas as an overlay
    const overlayLayer = new ol.layer.Image({
        source: new ol.source.Image({
            url: canvas.toDataURL(),
            projection: 'EPSG:4326',
            imageExtent: ol.proj.transformExtent([bbox[0], bbox[1], bbox[2], bbox[3]], 'EPSG:4326', 'EPSG:3857')
        })
    });

    map.addLayer(overlayLayer);
}
