var shoe = require('shoe');
var emitStream = require('emit-stream');
var JSONStream = require('JSONStream');

var stream = shoe('/sock').pipe(JSONStream.parse([true]));
var emitter = emitStream(stream);

var img = document.querySelector('#viewer');

emitter.on('image', function (data) {
console.log(data);
    img.setAttribute('src', 'data:image/png;base64,' + data);
});
