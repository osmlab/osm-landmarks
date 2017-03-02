module.exports = function (tileLayers, tile, writeData, done) {
    var osm = tileLayers.osm.osm;

    var results = [];
    for (var i = 0; i < osm.features.length; i++) {
        var feature = osm.features[i];
        var properties = feature.properties;
        if (('highway' in properties) && ('waterway' in properties)) {
            results.push(feature);
        }
    }

    if (results.length > 0) {
        console.log('\n' + results.join('\n'));
    }
    done(null, null);
};
