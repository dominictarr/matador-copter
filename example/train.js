var detect = require('../lib/detect');
var fs = require('fs');
var buf = fs.readFileSync(process.argv[2]);

console.log(detect(1280, 720, buf));
