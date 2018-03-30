const express = require('express');
const router = express.Router();
const ECHOPF = require('../ECHO.min');
const config = require('../config');
const jwt = require('jsonwebtoken');

ECHOPF.initialize(
    config.accountDomain,
    config.applicationId,
    config.applicationKey
);

/* GET login page */
router.get('/new', (req, res, next) => {
  res.render('sessions/new');
});

router.post('/', (req, res, next) => {
  new ECHOPF.Members.login(
    'member',
    req.body.login_id,
    req.body.password)
    .then(user => {
      const json = {
        accessToken: user.get('access_token'),
        refId: user.refid,
        login_id: user.get('login_id'),
        name: user.get('contents').name,
        email: user.get('contents').email
      }
      var token = jwt.sign(json, config.secret, {
        expiresIn: '1h'
      });
      res.cookie('token', token);
      return res.redirect('/');
    }, err => {
      res.render('sessions/new', {
          error: err
      });
    });
});

router.delete('/', (req, res, next) => {
  res.clearCookie('token');
  return res.redirect('/');
});

module.exports = router;