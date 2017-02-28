var csv = require('csv');
var path = require('path');
var fs = require('fs');

var directory = path.join(__dirname, 'osm-landmarks/');

function getRows(file, callback) {
    csv.parse(fs.readFileSync(file), function (error, rows) {
        if (error) callback(error, []);
        return callback(null, rows.slice(1, rows.length));
    });
}

function getLakes(callback) {
    var file = path.join(directory, 'lakes.csv');
    return getRows(file, callback);
}

function getAirports(callback) {
    var file = path.join(directory, 'airports.csv');
    return getRows(file, callback);
}

module.exports = {
    'getLakes': getLakes,
    'getAirports': getAirports
};
