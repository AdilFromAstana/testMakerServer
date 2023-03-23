const Router = require('express');
const router = new Router();
const testController = require('../controllers/testController');

router.post('/question', testController.createQuestion);
router.get('/getTest', testController.getTest);
router.post('/saveResult', testController.saveResult);
router.post('/read', testController.readFilesHandler);

module.exports = router;
