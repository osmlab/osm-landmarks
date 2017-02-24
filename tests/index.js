var test = require('tape');
var csv = require('csv');
var path = require('path');
var fs = require('fs');
var getLakes = require('..').getLakes;

test('Test format of csv files', function(t) {
    var dirname = path.join(__dirname, '../landmarks/');
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
    getLakes(function (error, lakes) {
        t.true(lakes.length > 0, 'Read ' + lakes.length + ' lakes');
        t.end();
    });
});
