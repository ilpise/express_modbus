var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.json({"fc": 3, "byteCount": 2, "payload": {"type": "Buffer", "data": [0, 14]}, "register": [14]});

});

module.exports = router;
