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

module.exports = client
