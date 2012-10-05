var shoe = require('shoe');
var emitStream = require('emit-stream');
var JSONStream = require('JSONStream');

var stream = shoe('/sock').pipe(JSONStream.parse([true]));
var emitter = emitStream(stream);

var img = document.querySelector('#viewer');
var crosshairs = document.querySelector('#crosshairs');

emitter.on('image', function (data) {
    img.setAttribute('src', 'data:image/png;base64,' + data);
});

emitter.on('red', function () {
    crosshairs.className = 'active';
    setTimeout(function () {
        crosshairs.className = '';
    }, 500);
});
