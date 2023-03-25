const Router = require('express');
const router = new Router();
const testRouter = require('./testRouter');
const userRouter = require('./userRouter');

router.use('/test', testRouter);
router.use('/user', userRouter);

module.exports = router;
