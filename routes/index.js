const { Router } = require('express');

const routeGuardMiddleware = require('../middleware/route-guard');

const router = Router();

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/main', routeGuardMiddleware, (req, res, next) => {
  res.render('main');
});

router.get('/private', routeGuardMiddleware, (req, res, next) => {
  res.render('private');
});

module.exports = router;
