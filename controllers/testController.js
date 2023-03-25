const uuid = require('uuid');
const path = require('path');
var fs = require('fs');
var formidable = require('formidable');
var filereader = require('../filereader');
const { Question, Answer, Test, Result, Subject } = require('../models/models');
const seq = require('../db');
const { Sequelize } = require('../db');
const { Op } = require('sequelize');

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

    async createTest(req, res) {
        try {
            const { questionCount, subjectId } = req.body;
            await Question.findAll({
                where: { subjectId: subjectId },
                order: seq.random(),
                limit: questionCount,
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
                        console.log(questionList);
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
            console.log(req);
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                fs.readFile(files.file.filepath, 'utf-8', (err, data) => {
                    filereader.extract(files.file.filepath).then(function (res, err) {
                        // const data = res.replace(/^\s+|\s+$|&lt;|&gt;/g, '');
                        // const questionAndAnwers = data.split('question');
                        // questionAndAnwers.map(async (el, i) => {
                        //     if (el !== '') {
                        //         const splitedData = el.replace(/^\s+|\s+$/g, '').split('variant');
                        //         if (splitedData[0] !== '') {
                        //             await Question.create({
                        //                 questionText: splitedData[0],
                        //                 subjectId: 1,
                        //             })
                        //                 .then(async (data) => {
                        //                     if (data) {
                        //                         const variants = splitedData.slice(1);
                        //                         variants.map(async (el, i) => {
                        //                             el.replace(/^\s+|\s+$/g, '');
                        //                             if (i === 0) {
                        //                                 await Answer.create({
                        //                                     answerText: el,
                        //                                     isCorrect: true,
                        //                                     questionId: data.id,
                        //                                 });
                        //                             } else {
                        //                                 await Answer.create({
                        //                                     answerText: el,
                        //                                     isCorrect: false,
                        //                                     questionId: data.id,
                        //                                 });
                        //                             }
                        //                         });
                        //                     }
                        //                 })
                        //                 .finally(() => {
                        //                     if (i + 1 === questionAndAnwers.length) {
                        //                         return responce.status(200).send('ok');
                        //                     }
                        //                 });
                        //         }
                        //     }
                        // });
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

    async getSubjectList(req, res) {
        try {
            await Subject.findAll().then((data) => {
                return res.status(200).send(data);
            });
        } catch (e) {
            return res.status(500).send(e);
        }
    }

    async getQuestionCount(req, res) {
        try {
            const { subjectId } = req.query;
            await Question.findAndCountAll({ where: { subjectId } }).then((data) => {
                return res.status(200).send(data.count.toString());
            });
        } catch (e) {
            return res.status(500).send(e);
        }
    }

    async getTest(req, res) {
        try {
            const { testId } = req.query;
            const result = await Result.findOne({ where: { testId: testId } });
            const unHashQuestionIdArray = result.hashStudentAnswers.split('-').map((el) => Number(el.split(':')[0]));
            const unHashListOfObject = result.hashStudentAnswers.split('-').map((el) => {
                return { qId: Number(el.split(':')[0]), aId: Number(el.split(':')[1]) };
            });
            const quastionList = await Question.findAll({
                where: { id: { [Op.or]: unHashQuestionIdArray } },
                include: [{ model: Answer, as: 'variants' }],
            }).then((da) => {
                const data = da.map((question) => {
                    const findAnswer = unHashListOfObject.find((questionFromObject) => {
                        return questionFromObject.qId === question.id;
                    });
                    return { ...question.dataValues, ...findAnswer };
                });
                return res.json(data);
            });
            // const data = quastionList.map((question) => {
            //     const findAnswer = unHashListOfObject.find((questionFromObject) => {
            //         return questionFromObject.qId === question.id;
            //     });
            //     console.log({ ...question, ...findAnswer });
            //     return { question, ...findAnswer };
            // });
        } catch (e) {
            return res.status(500).send(e);
        }
    }
}

module.exports = new DeviceController();
