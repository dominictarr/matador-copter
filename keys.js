var keypress = require('keypress')
keypress(process.stdin)

if (process.stdin.setRawMode)
  process.stdin.setRawMode(true)
else
  require('tty').setRawMode(true)

process.stdout.write('\x1b[3h')

//keypress.enableMouse(process.stdout)
process.on('exit', function () {
  //disable mouse on exit, so that the state is back to normal
  //for the terminal.
  //keypress.disableMouse(process.stdout)
})

process.stdin.resume()

module.exports = process.stdin


