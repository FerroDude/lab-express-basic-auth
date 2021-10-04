'use strict';

const { Router } = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

const authenticationRouter = Router();

authenticationRouter.get('/register', (req, res, next) => {
  res.render('register');
});

authenticationRouter.get('/log-in', (req, res, next) => {
  res.render('log-in');
});

authenticationRouter.post('/register', (req, res, next) => {
  const { username, password } = req.body;

  bcryptjs
    .hash(password, 10)
    .then((passwordHashAndSalt) => {
      return User.create({
        username,
        passwordHashAndSalt
      });
    })
    .then((user) => {
      req.session.userId = user._id;
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

authenticationRouter.post('/log-in', (req, res, next) => {
  const { username, password } = req.body;
  let user;
  User.findOne({ username })
    .then((document) => {
      if (!document) {
        return Promise.reject(new Error("There's no user with that email."));
      } else {
        user = document;
        return bcryptjs.compare(password, user.passwordHashAndSalt);
      }
    })
    .then((result) => {
      if (result) {
        req.session.userId = user._id;
        console.log(user);
        res.redirect('/private');
      } else {
        return Promise.reject(new Error('Wrong password.'));
      }
    })
    .catch((error) => {
      next(error);
    });
});

authenticationRouter.post('/log-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = authenticationRouter;
