const { Router } = require('express');
const authenticationRouter = Router();
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

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

module.exports = authenticationRouter;
