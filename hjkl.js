var drone = require('ar-drone');
var client = drone.createClient();
client.disableEmergency();

var flying = false;
var speed = 1;

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
});

process.stdin.setRawMode(true);
process.stdin.resume();
