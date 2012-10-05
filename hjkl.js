var drone = require('ar-drone');
var client = drone.createClient();
client.disableEmergency();

var flying = false;
var redMode = false;
var speed = 1;

var detect = require('./lib/detect');
var png = client.createPngStream({ log : process.stderr });
png.on('error', function (err) {
    console.error('caught error ' + err);
});

var last = 0;
png.on('data', function (buf) {
    if (!redMode) return;
    if (Date.now() - last < 500) return;
    last = Date.now();
    
    if (detect(640, 360, buf)) {
        console.log(Date.now());
        client.front(1);
        setTimeout(function () {
            client.stop();
        }, 1000);
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
    if (s === 'h') client.counterClockwise(speed);
    if (s === 'j') client.down(speed);
    if (s === 'k') client.up(speed);
    if (s === 'l') client.clockwise(speed);
    
    if (s === 'w') client.front(speed);
    if (s === 's') client.back(speed);
    
    if (s === ' ') {
        if (flying) client.land();
        else client.takeoff();
        flying = !flying;
    }
    if (s === 'x') client.stop();
    if (s === 'r') {
        redMode = true;
    }
});

process.stdin.setRawMode(true);
process.stdin.resume();
