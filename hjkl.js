var drone = require('ar-drone');
var client = drone.createClient();
client.disableEmergency();

var flying = false;

process.stdin.on('data', function (buf) {
    if (buf[0] === 3) {
        client.land();
        process.exit();
    }
    
    var s = String.fromCharCode(buf[0]);
    if (s === 'h') client.counterClockwise(0.2);
    if (s === 'j') client.down(0.2);
    if (s === 'k') client.up(0.2);
    if (s === 'l') client.clockwise(0.2);
    
    if (s === ' ') {
        if (flying) client.land();
        else client.takeoff();
        flying = !flying;
    }
    if (s === 'x') client.stop();
});

process.stdin.setRawMode(true);
process.stdin.resume();
