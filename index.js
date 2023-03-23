require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const path = require('path');
const { readFilesHandler } = require('./filecontentReader');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);

app.use((req, res, next) => {
    const allowedOrigins = [
        'http://192.168.0.178:3000',
        'http://localhost:3000',
        'http://192.168.0.178:3001',
        'http://localhost:3001',
        'http://localhost:3000',
        'http://172.20.10.7:3000',
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, PUT, CREATE, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
});

// Обработка ошибок, последний Middleware

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true }).then(() => {
            console.log('[=====================>   Drop and Resync Db   <=====================]');
        });

        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();
