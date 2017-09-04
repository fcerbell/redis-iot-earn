var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Redis Labs IOT Demo', desc: 'Some IOT data vizualized' });
});

module.exports = router;
