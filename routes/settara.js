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

/* Autotara. */
router.use('/', function(req, res, next) {
  console.log('----- Autotara. ');
  var counter = 5;
  var check = setInterval(function(){
    console.log(counter);
    console.log(_thisclient.getState());
    counter--

      if (_thisclient && _thisclient.inState('ready')) {
        //// Scrive nel command register 502 il valore 0x0002 Autotara
        _thisclient.writeSingleRegister(502, Buffer.from([0x00, 0x02])).then(function (resp) {
          console.log('###### Response from set tara');
          console.log(resp)

          // Response
          // { fc: 6,
          // registerAddress: 502,
          // registerValue: 2,
          // registerAddressRaw: <Buffer 01 f6>,
          // registerValueRaw: <Buffer 00 02> }

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
router.get('/', function(req, res, next) {
  console.log('----- LETTURA lordo - netto');
  var counter = 5;
  var check = setInterval(function(){
    console.log(counter);
    console.log(_thisclient.getState());
    counter--
      if (_thisclient && _thisclient.inState('ready')) {
        _thisclient.readHoldingRegisters(1, 4).then(function (resp) {
          console.log('###### Response');
          console.log(resp)

          // Response
          // { fc: 3,
          //   byteCount: 8,
          //   payload: <Buffer 00 00 00 24 00 00 00 00>,
          //   register: [ 0, 36, 0, 0 ] }

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
