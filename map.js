
var keys = require('./keys')

var client = require('ar-drone').createClient()

client.config('general:navdata_demo', 'FALSE');

function modifiers (key) {
var mods =''

  if(!key) return
  ;['shift', 'meta', 'ctrl'].forEach(function (m) {
    if(key[m])
      mods += m + '_'
  })
  return mods + key.name
}

function resetable(fun) {
  var timer = null

  function clear () {
    console.log('clear')
    clearTimeout(timer)
    timer = null
    fun.call(client, 0)
  }

  return function (n) {
    if(n) {
      clearTimeout(timer)
      timer = setTimeout(clear, 400)
      fun.call(client, n)
    } else
      clear()
  }
}

var ctrl = {
  f: resetable(client.front),
  t: resetable(client.counterClockwise),
  a: resetable(client.up),
  s: resetable(client.left),
}

var cmd = {
  ctrl_c: function () {
    process.exit()
  },

  left:         function () { ctrl.t(1)  },
  right:        function () { ctrl.t(-1) },

  shift_left:   function () { ctrl.t(.5)  },
  shift_right:  function () { ctrl.t(-0.5) },

  up:           function () { ctrl.f(1)  },
  down:         function () { ctrl.f(-1) },

  ',':          function () { ctrl.s(-1)  },
  '.':          function () { ctrl.s(1)  },

  shift_up:     function () { ctrl.a(1)  },
  shift_down:   function () { ctrl.a(-1) },

  shift_t:      function () { client.takeoff(1) },
  shift_l:      function () { client.land(1) },

}

keys.on('keypress', function (_, k) {

  var m = modifiers(k)
  console.log(m, k, _)
  if(cmd[m])
    cmd[m]()
})

client.on('navdata', console.log)
