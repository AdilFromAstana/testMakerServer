var bcrypt = require('bcrypt');
const { User } = require('../models/models');

class userController {
    async login(req, res) {
        try {
            console.log(req.body);
            const { username, password } = req.body;
            const user = await User.findOne({
                username,
            });
            if (!user) {
                return res.status(400).json({ message: `Пользователь ${username} не найден` });
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: `Введен неверный пароль` });
            }

            return res.json({ username: user.username, id: user.id });
        } catch (e) {
            console.log(e.message);
        }
    }

    async registration(req, res) {
        try {
            const { username, password } = req.body;
            const candidate = await User.findOne({ username });
            if (candidate) {
                return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            await User.create({ username, password: hashPassword })
                .then(() => {
                    return res.json({ message: 'Пользователь успешно зарегистрирован' });
                })
                .catch(() => {
                    return res.status(500).send(e);
                });
        } catch (e) {
            return res.json(e);
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (e) {
            console.log(e.message);
        }
    }

    async getUser(req, res) {
        try {
            const data = req.params;
            const user = await User.findByPk(data.id);
            res.json(user);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new userController();
