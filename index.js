var csv = require('csv');
var path = require('path');
var fs = require('fs');

function getLandmarks(landmark, callback) {
    var directory = path.join(__dirname, 'osm-landmarks/');
    var file = path.join(directory, landmark + '.csv');

    csv.parse(fs.readFileSync(file), function (error, rows) {
        if (error) callback(error, []);
        return callback(null, rows.slice(1, rows.length));
    });
}



module.exports = {
    'getLandmarks': getLandmarks
};
