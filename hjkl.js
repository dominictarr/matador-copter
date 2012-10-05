var drone = require('ar-drone');
var client = drone.createClient();
client.disableEmergency();

var shoe = require('shoe');
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter;

var http = require('http');
var ecstatic = require('ecstatic');
var emitStream = require('emit-stream');

var server = http.createServer(ecstatic(__dirname + '/static'));
server.listen(8000);
var JSONStream = require('JSONStream');

var sock = shoe(function (stream) {
    emitStream(emitter).pipe(JSONStream.stringify()).pipe(stream);
});
sock.install(server, '/sock');

var flying = false;
var redMode = true;
var speed = 1;

var detect = require('./lib/detect');

var png = client.createPngStream({ log : process.stderr });
png.on('error', function (err) {
    console.error('caught error ' + err);
});

var last = 0;
var detected = false;

png.on('data', function (buf) {
    if (Date.now() - last < 1000) return;
    last = Date.now();
    
    emitter.emit('image', buf.toString('base64'));
    
    if (!redMode) return;
    if (detected) return;
    
    if (detect(640, 360, buf)) {
        detected = true;
        emitter.emit('red');
        
        console.log(Date.now());
        client.front(1);
        
        setTimeout(function () {
            client.stop();
            client.front(0);
            
            client.clockwise(1);
        }, 1000);
        
        setTimeout(function () {
            client.clockwise(0);
        }, 4000);
        
        setTimeout(function () {
            detected = false;
            emitter.emit('unred');
        }, 5000);
    }
});

process.stdin.on('data', function (buf) {
    if (buf[0] === 3) {
        client.land();
        setTimeout(function () {
            process.exit();
        }, 250);
    }
    
    var s = String.fromCharCode(buf[0]);
    if (s === 'h') {
        client.counterClockwise(speed);
        setTimeout(function () { client.counterClockwise(0) }, 250);
    }
    if (s === 'j') {
        client.down(speed);
        setTimeout(function () { client.down(0) }, 250);
    }
    if (s === 'k') {
        client.up(speed);
        setTimeout(function () { client.up(0) }, 250);
    }
    if (s === 'l') {
        client.clockwise(speed);
        setTimeout(function () { client.clockwise(0) }, 250);
    }
    
    if (s === 'w') {
        client.front(speed);
        setTimeout(function () { client.front(0) }, 250);
    }
    if (s === 's') {
        client.back(speed);
        setTimeout(function () { client.back(0) }, 250);
    }
    
    if (s === ' ') {
        if (flying) client.land();
        else client.takeoff();
        flying = !flying;
    }
    if (s === 'x') client.stop();
    if (s === 'r') redMode = !redMode;
});

process.stdin.setRawMode(true);
process.stdin.resume();
