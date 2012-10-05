var fs = require('fs');
var Canvas = require('canvas');
var Image = Canvas.Image;
var rgb2hsl = require('color-convert').rgb2hsl;

var canvas = new Canvas(1280 / 4, 720 / 4);
var ctx = canvas.getContext('2d');

fs.readFile(process.argv[2], function (err, src) {
    var img = new Image();
    img.src = src;
    ctx.drawImage(img, 0, 0, img.width / 4, img.height / 4);
    
    var data = ctx.getImageData(0, 0, img.width / 4, img.height / 4).data;
    
    var matches = 0;
    for (var i = 0; i < data.length; i += 4 * 8) {
        var hsl = rgb2hsl(data[i], data[i + 1], data[i + 2]);
        var h = hsl[0], s = hsl[1], l = hsl[2];
        
        if ((h < 20 || h > (360 - 20)) && s > 30 && l > 30 && l < 150) {
            matches ++;
        }
    }
    console.log(matches > 30);
});
