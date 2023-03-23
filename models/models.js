const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const Device = sequelize.define('device', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    img: { type: DataTypes.STRING, allowNull: false },
});

const Subject = sequelize.define('subject', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    subjectText: { type: DataTypes.STRING, allowNull: false },
});

const Answer = sequelize.define('answer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    answerText: { type: DataTypes.STRING, allowNull: false },
    isCorrect: { type: DataTypes.BOOLEAN, allowNull: false },
    questionId: { type: DataTypes.INTEGER, allowNull: false },
});

const Question = sequelize.define('question', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    questionText: { type: DataTypes.TEXT, allowNull: false },
    subjectId: { type: DataTypes.INTEGER, allowNull: false },
});

const Test = sequelize.define('test', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    hashTestQuestions: { type: DataTypes.TEXT, allowNull: false },
});

const Result = sequelize.define('result', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    testId: { type: DataTypes.INTEGER, allowNull: false },
    hashStudentAnswers: { type: DataTypes.TEXT, allowNull: false },
    resultInPercent: { type: DataTypes.FLOAT, allowNull: false },
});

Question.hasMany(Answer, { as: 'variants' });
Answer.belongsTo(Question, {
    foreignKey: {
        name: 'questionId',
    },
});

Result.hasOne(Test);
Test.belongsTo(Result);

module.exports = {
    Device,
    Answer,
    Subject,
    Question,
    Test,
    Result,
};
