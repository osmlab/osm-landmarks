var csv = require('csv');
var path = require('path');
var fs = require('fs');

function getLakes(callback) {
    var directory = path.join(__dirname, 'osm-landmarks/');
    var file = path.join(directory, 'lakes.csv');

    csv.parse(fs.readFileSync(file), function (error, rows) {
        if (error) callback(error, []);
        return callback(null, rows.slice(1, rows.length));
    });
}

module.exports = {
    'getLakes': getLakes
};
