const express = require('express');
const router = express.Router();
const ECHOPF = require('../ECHO.min');
const config = require('../config');

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
