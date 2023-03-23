const Router = require('express');
const router = new Router();
const deviceRouter = require('./deviceRouter');
const testRouter = require('./testRouter');

router.use('/device', deviceRouter);
router.use('/test', testRouter);

module.exports = router;
