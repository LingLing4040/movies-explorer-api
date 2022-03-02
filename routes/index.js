const router = require('express').Router();
const NotFoundError = require('../errors/not-found-error');
const auth = require('../middlewares/auth');

const authRouter = require('./auth-router');
const usersRouter = require('./users');
const moviesRouter = require('./movies');

router.use('/', authRouter);
router.use(auth);
router.use('/', usersRouter);
router.use('/', moviesRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

module.exports = router;
