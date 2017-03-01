var argv = require('minimist')(process.argv.slice(2));
var overpass = require('query-overpass');
var util = require('util');
var fs = require('fs');
var csv = require('csv');
var queue = require('d3-queue').queue;
var Levenshtein = require('levenshtein');

if (!argv.wikidata) {
    console.log('');
    console.log('Usage: node overpass-query.js OPTIONS');
    console.log('');
    console.log('  OPTIONS');
    console.log('    --wikidata restaurants.csv');
    console.log('');
    return;
}

function queryOverpass(wikidataID, restaurantName, lat, lon, callback) {
    // console.log(wikidataID);
    // wikidataID = 'Q5359767';
    var query = fs.readFileSync(__dirname + '/overpass-query.ql').toString();
    query = query.replace(/lat/g, lat);
    query = query.replace(/lon/g, lon);

    overpass(query, function(error, data) {
        if (error) return callback(error, null);

        var osmID = '';
        var osmName = '';
        var osmType = '';
        var minDistance = 100;
        for (var i = 0; i < data.features.length; i++) {
            try {
                var distance = new Levenshtein(data.features[i].properties.tags.name, restaurantName).distance;
                if (distance < minDistance) {
                    minDistance = distance;
                    osmID = data.features[i].properties.id;
                    osmName = data.features[i].properties.tags.name;
                    osmType = data.features[i].properties.type;
                }
            }
            catch (e) {
                //do nothing
            }
        }
        console.log(wikidataID + ',' + restaurantName + ',' + osmID + ',' + osmType + ',' + osmName + ',' + minDistance);
        callback(error, osmID);
    });
}

var q = queue(1);

csv.parse(fs.readFileSync(argv.wikidata), function (error, rows) {
    header = [];
    for (var i = 0; i < rows.length; i++) {
        if (header.length === 0) {
            header = rows[i];
            continue;
        }
        var wikidataID = rows[i][0].split('/').slice(-1)[0];
        var latlon = rows[i][3];
        var coordinates = '';
        if (latlon.length > 0) {
            coordinates = latlon;
            var lon = (coordinates.split('(')[1]).split(' ')[0];
            var lat = coordinates.split('(')[1].split(' ')[1].split(')')[0];
            q.defer(queryOverpass, wikidataID, rows[i][1], lat, lon);
        }
    }

    q.awaitAll(function(error, results) {
        if (error) console.log(error);
        // console.log(JSON.stringify(results));
    });
});
