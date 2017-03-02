var readline = require('readline');
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var csv = require('csv');

if (!argv.json) {
    console.log('');
    console.log('node parse.js OPTIONS');
    console.log('');
    console.log('  OPTIONS');
    console.log('    --json restaurants.json');
    console.log('');
    return;
}

var reader = readline.createInterface({
    input: fs.createReadStream(argv.json),
    output: null
});

var  features = [];
var header = ['id', 'name', 'type', 'version', 'properties', 'phone', 'website'];
features.push(header)

reader.on('line', function (line) {
    try {
        var restaurant = JSON.parse(line);

        features.push([
            restaurant.properties['@id'],
            ('name' in restaurant.properties) ? restaurant.properties['name'] : '',
            restaurant.properties['@type'],
            restaurant.properties['@version'],
            Object.keys(restaurant.properties).length - 7,
            ('phone' in restaurant.properties) ? 1 : 0,
            ('website' in restaurant.properties) ? 1 : 0,
        ])
    } catch (error) {

    }
});

reader.on('close', function () {
    csv.stringify(features, function (error, featuresAsString) {
        if (error) console.log(error);
        console.log(featuresAsString);
    });
});
