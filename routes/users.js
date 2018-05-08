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

/* GET users listing. */
router.get('/', (req, res, next) => {
    res.render('users/index');
});

router.get('/new', (req, res, next) => {
    res.render('users/new');
});

const getCurrentUser = (req) => {
  try {
    const token = req.cookies.token;
    const user = jwt.verify(token, config.secret);
    return user;
  } catch(err) {
    return false;
  }
}

router.put('/me', (req, res, next) => {
  const currentUser = getCurrentUser(req);
  if (!currentUser) {
  } else {
    res.clearCookie('token');
    return res.redirect('/');
  }
  ECHOPF.accessToken = currentUser.accessToken;
  const member = new ECHOPF.Members
    .MemberObject('member', currentUser.refId);
  member
    .fetch()
    .then(user => {
      user
        .put('contents', {
          name: req.body.name,
          email: req.body.email
        })
      return user.push();
    }, err => console.log(err))
    .then(user => {
      const json = {
        accessToken: currentUser.accessToken,
        refId: user.refid,
        login_id: user.get('login_id'),
        name: user.get('contents').name,
        email: user.get('contents').email
      }
      var token = jwt.sign(json, config.secret, {
        expiresIn: '1h'
      });
      res.cookie('token', token);
      res.redirect('/users/edit');
    }, err => console.log(err))
});

router.get('/edit', (req, res, next) => {
  const user = getCurrentUser(req);
  if (user) {
    res.render('users/edit', {user});
  } else {
    res.clearCookie('token');
    return res.redirect('/');
  }
});

router.post('/', (req, res, next) => {
    const params = req.body;
    if (params.password !== params.password_confirmation) {
        return res.render('users/new', {
            error: 'パスワードが一致しません'
        });
    }
    const member = new ECHOPF.Members.MemberObject('member');
    member.put('login_id', params.login_id);
    member.put('password', params.password);
    member.put('contents', {
        name: params.name,
        email: params.email
    });
    member
        .push()
        .then((result) => {
            res.redirect('/users/success');
        }, (err) => {
            console.log(err);
            res.render('users/new', {
                error: err
            });
        });
});

router.get('/success', (req, res, next) => {
    res.render('users/success');
});
module.exports = router;
