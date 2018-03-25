var express = require('express');
var router = express.Router();
var modbus = require('jsmodbus');
var node_modbus = require('node-modbus');

// create a modbus client
var client = node_modbus.client.tcp.complete({
        'host'              : '192.168.1.77',
        'port'              : 502,
        // 'autoReconnect'     : true,
        'autoReconnect'     : false,
        'reconnectTimeout'  : 1000,
        'timeout'           : 5000,
        'unitId'            : 1,
        'logEnabled': true,
        'logLevel': 'debug'
    });

client.on( 'close', function () {
  console.log('###### Modbus received close');
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('in request');
  // console.log(client);
  client.on('connect', function () {
      console.log('###### Closing on demand');
      client.close();

  });

  client.connect();
});

module.exports = router;
