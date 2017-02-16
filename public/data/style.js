var tileset = 'mapbox.streets';
var Style = {
    "version": 8,
    "sources": {
        "raster-tiles": {
            "type": "raster",
            "url": "mapbox://" + tileset,
            "tileSize": 256
        }
    },
    "layers": [{
        "id": "simple-tiles",
        "type": "raster",
        "source": "raster-tiles",
        "minzoom": 0,
        "maxzoom": 22
    }]
};

exports.Style = Style;