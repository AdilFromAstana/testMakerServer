const uuid = require('uuid');
const path = require('path');
var fs = require('fs');
var formidable = require('formidable');
var filereader = require('../filereader');
const { Question, Answer, Test, Result } = require('../models/models');
const seq = require('../db');

class DeviceController {
    async createQuestion(req, res) {
        try {
            let data = req.body;
            await Question.create({
                questionText: data.questionText,
                subjectId: data.subjectId,
            });
            return res.json(data);
        } catch (e) {
            console.log(e.message);
        }
    }

    async createAnswer(req, res) {
        try {
            let data = req.body;
            await Answer.create({
                answerText: data.questionText,
                isCorrect: data.isCorrect,
                questionId: data.questionId,
            });
            return res.json(data);
        } catch (e) {
            console.log(e.message);
        }
    }

    async getTest(req, res) {
        try {
            await Question.findAll({
                order: seq.random(),
                limit: 25,
                include: [{ model: Answer, as: 'variants', order: seq.random() }],
            })
                .then(async (questionList) => {
                    const hashTest = questionList.map((el) => {
                        return el.id;
                    });
                    await Test.create({
                        hashTestQuestions: hashTest.join('-'),
                    }).then((createdTest) => {
                        let data = {
                            testId: createdTest.id,
                            test: questionList,
                        };
                        return res.json(data);
                    });
                })
                .catch((e) => {
                    console.log(e);
                });
        } catch (e) {
            console.log(e.message);
        }
    }

    async readFilesHandler(req, responce) {
        try {
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                fs.readFile(files.file.filepath, 'ucs2', (err, data) => {
                    filereader.extract(files.file.filepath).then(function (res, err) {
                        const data = res.replace(/^\s+|\s+$|&lt;|&gt;/g, '');
                        const questionAndAnwers = data.split('question');
                        questionAndAnwers.map(async (el) => {
                            if (el !== '') {
                                const splitedData = el.replace(/^\s+|\s+$/g, '').split('variant');
                                if (splitedData[0] !== '') {
                                    await Question.create({
                                        questionText: splitedData[0],
                                        subjectId: 1,
                                    })
                                        .then(async (data) => {
                                            if (data) {
                                                const variants = splitedData.slice(1);
                                                variants.map(async (el, i) => {
                                                    el.replace(/^\s+|\s+$/g, '');
                                                    if (i === 0) {
                                                        await Answer.create({
                                                            answerText: el,
                                                            isCorrect: true,
                                                            questionId: data.id,
                                                        });
                                                    } else {
                                                        await Answer.create({
                                                            answerText: el,
                                                            isCorrect: false,
                                                            questionId: data.id,
                                                        });
                                                    }
                                                });
                                            }
                                        })
                                        .then(() => {
                                            responce.status(200).send('Всё вроде ок');
                                        });
                                }
                            }
                        });
                    });
                    // console.log(data);
                });
            });
        } catch (e) {
            console.log(e);
        }
    }

    async saveResult(req, res) {
        try {
            const data = req.body;
            await Result.create({
                testId: data.testId,
                hashStudentAnswers: data.hashStudentAnswers,
                resultInPercent: data.resultInPercent,
            }).then((data) => {
                return res.json(data.id);
            });
        } catch (e) {
            console.log(e.message);
        }
    }
}

module.exports = new DeviceController();
