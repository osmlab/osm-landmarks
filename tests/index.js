var test = require('tape');
var csv = require('csv');
var path = require('path');
var fs = require('fs');
var getLandmarks = require('..').getLandmarks;

test('Test format of csv files', function(t) {
    var dirname = path.join(__dirname, '../osm-landmarks/');
    var files = fs.readdirSync(dirname);

    // Filter out only csv files in the directory.
    files = files.filter(function(filename) { return /.csv$/.test(filename); });

    files.forEach(function(filename) {
        csv.parse(fs.readFileSync(path.join(dirname, filename)), function (error, rows) {
            if (error) t.fail(error);

            header = rows[0];
            t.true(header.indexOf('id') !== -1, filename + ' has header "id"');
            t.true(header.indexOf('type') !== -1, filename + ' has header "type"');
        });
    });
    t.end();
});

test('Test getLakes', function (t) {
    getLandmarks('lakes', function (error, lakes) {
        t.true(lakes.length > 0, 'Read ' + lakes.length + ' lakes');
        t.end();
    });
});

test('Test getRestaurants', function (t) {
    getLandmarks('restaurants', function (error, restaurants) {
        t.true(restaurants.length > 0, 'Read ' + restaurants.length + ' lakes');
        t.end();
    });
});
