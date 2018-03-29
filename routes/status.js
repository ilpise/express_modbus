var express = require('express');
var router = express.Router();
var modbus = require('jsmodbus');
var node_modbus = require('node-modbus');

// create a modbus client
console.log("------- CREATE MODBUS CLIENT -------");
var client = node_modbus.client.tcp.complete({
        'host'              : '192.168.1.77',
        'port'              : 502,
        'autoReconnect'     : false,
        // 'autoReconnect'     : true,
        // 'reconnectTimeout'  : 1000,
        'timeout'           : 5000,
        'unitId'            : 1,
        'logEnabled': true,
        'logLevel': 'debug'
    });



client.on('error', function (err) {
  console.log('##### Client error');
  console.log(err)
})

client.on('close', function () {
  console.log('##### Client closed')
})

client.on('connect', function () {
  console.log('##### Connected')
  // return true;
  // client.readHoldingRegisters(0, 1).then(function (resp) {
  //   console.log('###### Response');
  //   console.log(resp)
  //
  //   // next('route')
  // }).catch(function (err) {
  //   console.log('##### Error')
  //   console.log(err)
  //   // next(err)
  // }).done(function () {
  //   console.log('###### Done');
  //   client.close()
  // })
})

var _thisclient = null;
// a middleware function with no mount path. This code is executed for every request to the router
router.use(function (req, res, next) {
  console.log(' ----------- - Time:', Date.now())
  console.log(client.getState());
  if(client.getState() != 'ready') { // Call connect if we are not connected
    console.log("##### Calling connect");
    _thisclient = client.connect();
    console.log('_thisclient');
    // console.log(_thisclient);
  }
  next();
})

/* GET DATS status. */
router.get('/', function(req, res, next) {
  console.log('----- Req ');

  // Response
  // {"fc":3,"byteCount":2,"payload":{"type":"Buffer","data":[0,14]},"register":[14]}

  var counter = 5;
  var check = setInterval(function(){
    console.log(counter);
    console.log(_thisclient.getState());
    counter--
    // if (counter === 0) {
      if (_thisclient && _thisclient.inState('ready')) {
        _thisclient.readHoldingRegisters(0, 1).then(function (resp) {
          console.log('###### Response');
          console.log(resp)
          clearInterval(check);
          res.json(resp);
        }).catch(function (err) {
          console.log('##### Error')
          console.log(err)
          // { err: 'modbus client not in "ready" state' }
          clearInterval(check);
          _thisclient.close()
          next(err)
        }).done(function () {
          console.log('###### Done');
          clearInterval(check);
          _thisclient.close()
        })
      }
      if (_thisclient && _thisclient.inState('closed')) {
        _thisclient.connect();
      }
  }, 1000);

});

module.exports = router;
