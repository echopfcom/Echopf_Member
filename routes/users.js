const express = require('express');
const router = express.Router();
const ECHOPF = require('../ECHO.min');
accountDomain = 'member-site.echopf.com';
applicationId = '803f5eaf1db10b95bb43cce89297cdf0';
applicationKey = '029425c6c320948949435796c9f618aa';

ECHOPF.initialize(
    accountDomain,
    applicationId,
    applicationKey
);

/* GET users listing. */
router.get('/', (req, res, next) => {
    res.render('users/index');
});

router.post('/', (req, res, next) => {
    const member = new ECHOPF.Members.MemberObject('member');
    console.log(req.body);
    const params = req.body;
    if (params.password !== params.password_confirmation) {
        return res.render('users/index', {
            error: 'パスワードが一致しません'
        });
    }
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
            res.render('users/index', {
                error: err
            });
        });
});

router.get('/success', (req, res, next) => {
    res.render('users/success');
});
module.exports = router;
