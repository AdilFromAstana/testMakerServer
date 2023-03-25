const Router = require('express');
const router = new Router();
const testController = require('../controllers/testController');

router.post('/question', testController.createQuestion);
router.post('/createTest', testController.createTest);
router.post('/saveResult', testController.saveResult);
router.post('/readFile', testController.readFilesHandler);
router.get('/getSubjectList', testController.getSubjectList);
router.get('/getQuestionCount', testController.getQuestionCount);
router.get('/getTest', testController.getTest);

module.exports = router;
