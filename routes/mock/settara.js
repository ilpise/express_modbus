var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.json({
    fc: 3,
    byteCount: 8,
    payload: "<Buffer 00 00 00 24 00 00 00 00>",
    register: [0, 36, 0, 0]
  });

});

module.exports = router;
