const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const auth = require('http-auth');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');

const router = express.Router();

const Registration = require('../models/Registration');
const UserDetail = require('../models/User');
const Session = require('../models/Session');

const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd'),
});


passport.use(UserDetail.createStrategy());
passport.serializeUser(UserDetail.serializeUser());
passport.deserializeUser(UserDetail.deserializeUser());


router.get('/', (req, res) => {
  //res.send('It works!');
  res.render('index', { title: 'Hello' });
});


router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Sign Up' });
});

router.post('/signup', 
    [
        check('username')
        .isLength({ min: 1 })
        .withMessage('Please enter the username'),
        check('password')
        .isLength({ min: 1 })
        .withMessage('Please enter the password'),
    ],
    async (req, res) => {
        console.log(req.body);
        const errors = validationResult(req);
        if (errors.isEmpty()) {
          UserDetail.register(
                new UserDetail({ username: req.body.username }),
                req.body.password,
                function(err, user) {
                    if (err) {
                        console.log(err);
                        return res.render('signup', { 
                            title: 'Sign Up',
                            errors: [{ msg: err.message }],
                            data: req.body,
                        });
                    }
                    res.render('thankyou', { title: 'Thank you' });
                }
            );
        } else {
          res.render('signup', { 
              title: 'Sign Up',
              errors: errors.array(),
              data: req.body,
            });
        }
    });

router.get('/login', (req, res) => {
  res.render('login', { title: 'Log In' });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        console.log('User: ', user, err, info);
        if (err) {
            return next(err);
        }
        if (!user) {
          return res.render('login', { 
              title: 'Log In',
              errors: [{ msg: info && info.message ? info.message : 'Invalid username or password' }],
              data: req.body,
          });
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/profile');
        });
    })(req, res, next);
});

router.get('/profile', connectEnsureLogin.ensureLoggedIn({ redirectTo: '/' }), (req, res) => {
    Session.find({ username: req.user.username }).then((sessions) => {
      res.render('profile', { title: 'Your Game Sessions', sessions },);
    })
    .catch(() => { 
      res.send('Sorry! Something went wrong.'); 
    });
});

router.get('/add', connectEnsureLogin.ensureLoggedIn({ redirectTo: '/' }), (req, res) => {
  //res.send('It works!');
  res.render('addsession', { title: 'Log New Game Session' });
});

router.post('/add', 
    [
        check('date')
        .isLength({ min: 1 })
        .withMessage('Please enter the date'),
        check('game')
        .isLength({ min: 1 })
        .withMessage('Please enter the game name'),
        check('players')
        .isLength({ min: 1 })
        .withMessage('Please enter the players'),
        check('userScore')
        .isLength({ min: 1 })
        .withMessage('Please enter your score'),
    ],
    async (req, res) => {
        //console.log(req.body);
        const errors = validationResult(req);
        if (errors.isEmpty()) {
          const sessionData = {
              ...req.body,
              username: req.user.username
          };
          const session = new Session(sessionData);

          session.save()
            .then(() => { res.redirect('/profile'); })
            .catch((err) => {
              console.log(err);
              res.send('Sorry! Something went wrong.');
            });
          } else {
            res.render('addsession', { 
                title: 'Log New Game Session',
                errors: errors.array(),
                data: req.body,
             });
          }
    });

// router.get('/admin', basic.check((req, res) => {
//   Registration.find()
//     .then((registrations) => {
//       res.render('registrants', { title: 'Listing registrations', registrations });
//     })
//     .catch(() => { 
//       res.send('Sorry! Something went wrong.'); 
//     });
// }));

// router.get('/t', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
//     res.sendFile('../public/index2.html', { root: path.join(__dirname, '../public') });
// });


// router.get('/user', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
//     res.send({user: req.user})
// });

router.get('/logout', (req, res) => {
    req.logout((err) => {
        res.redirect('/');
    });
});


module.exports = router;