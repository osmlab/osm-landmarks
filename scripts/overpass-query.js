var argv = require('minimist')(process.argv.slice(2));
var overpass = require('query-overpass');
var util = require('util');
var fs = require('fs');
var csv = require('csv');
var queue = require('d3-queue').queue;

if (!argv.wikidata) {
    console.log('');
    console.log('Usage: node overpass-query.js OPTIONS');
    console.log('');
    console.log('  OPTIONS');
    console.log('    --wikidata restaurants.csv');
    console.log('');
    return;
}

function queryOverpass(wikidataID, callback) {
    // console.log(wikidataID);
    // wikidataID = 'Q5359767';
    var query = fs.readFileSync(__dirname + '/overpass-query.ql').toString();
    query = query.replace(/wikidataID/g, wikidataID);

    overpass(query, function(error, data) {
        if (error) return callback(error, null);

        var osmID = '';
        if (data.features.length > 0) {
            osmID = data.features[0]["id"];
        }
        console.log(wikidataID + ',' + osmID);
        callback(error, osmID)
    });
}

var q = queue(1);

csv.parse(fs.readFileSync(argv.wikidata), function (error, rows) {
    header = []
    for (var i = 0; i < rows.length; i++) {
        if (header.length === 0) {
            header = rows[i];
            continue;
        }
        var wikidataID = rows[i][0].split('/').slice(-1)[0];
        // console.log(wikidataID);
        q.defer(queryOverpass, wikidataID);
    }

    q.awaitAll(function(error, results) {
        if (error) console.log(error);
        // console.log(JSON.stringify(results));
    });
});
