var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.json({
    fc: 6,
    registerAddress: 502,
    registerValue: 32,
    registerAddressRaw: "<Buffer 01 f6>",
    registerValueRaw: "<Buffer 00 20>"
  });
})
module.exports = router;
