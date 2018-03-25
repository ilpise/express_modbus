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

/* Taratura di zero peso. */
router.use('/', function(req, res, next) {
  console.log('----- Taratura di zero peso. ');
  var counter = 5;
  var check = setInterval(function(){
    console.log(counter);
    console.log(_thisclient.getState());
    counter--

      if (_thisclient && _thisclient.inState('ready')) {
        //Scrive nel command register 502 il valore 0x0010 Taratura di zero peso
        _thisclient.writeSingleRegister(502, Buffer.from([0x00, 0x10])).then(function (resp) {
          console.log('###### Response from write');
          console.log(resp)
          clearInterval(check);
          // res.json(resp);
          next('route')
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

/* GET DATS status. */
router.use('/', function(req, res, next) {
  console.log('----- GET DATS status');
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
          //res.json(resp);
          next('route')
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
      //  else {
      //   res.json({"mbc": "noclient"});
      // }

    // }
  }, 1000);

});

// Salvataggio dati in eprom
router.get('/', function(req, res, next) {
  console.log('----- Salvataggio dati in eprom ');
  var counter = 5;
  var check = setInterval(function(){
    console.log(counter);
    console.log(_thisclient.getState());
    counter--
      if (_thisclient && _thisclient.inState('ready')) {
        // Scrive nel command register 502 il valore 0x0020 Salvataggio dati in memoria permanente
        _thisclient.writeSingleRegister(502, Buffer.from([0x00, 0x20])).then(function (resp) {
          console.log('###### Response');
          console.log(resp)
          clearInterval(check);
          res.json(resp);
          //next('route')
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
