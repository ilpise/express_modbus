var express = require('express');
var router = express.Router();

var _thisclient = null;
// a middleware function with no mount path. This code is executed for every request to the router
router.use(function (req, res, next) {
  console.log(' ----------- - Time:', Date.now())
  console.log(mbcli.getState());
  if(mbcli.getState() != 'ready') { // Call connect if we are not connected
    console.log("##### Calling connect");
    _thisclient = mbcli.connect();
    console.log('_thisclient');
    // console.log(_thisclient);
  } else {
    _thisclient = mbcli;
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

          // Response
          // { fc: 6,
          // registerAddress: 502,
          // registerValue: 16,
          // registerAddressRaw: <Buffer 01 f6>,
          // registerValueRaw: <Buffer 00 10> }

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

          // Response
          // { fc: 3,
          //   byteCount: 2,
          //   payload: <Buffer 02 07>,
          //   register: [ 519 ] }


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

          // Response
          // { fc: 6,
          //   registerAddress: 502,
          //   registerValue: 32,
          //   registerAddressRaw: <Buffer 01 f6>,
          //   registerValueRaw: <Buffer 00 20> }

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
