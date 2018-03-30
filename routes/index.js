var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  const token = req.cookies.token;
  const json = token
    ? JSON.parse(new Buffer(token.split('.')[1], 'base64').toString('ascii'))
    : {};
  res.render('index', { title: 'Express', json: json });
});

module.exports = router;
