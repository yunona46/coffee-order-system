const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Тимчасове сховище користувачів
let users = [];
let userIdCounter = 1;

const authController = {
    register: async (req, res) => {
        try {
            const { email, password, name } = req.body;

            if (!email || !password || !name) {
                return res.status(400).json({ message: 'Усі поля обов\'язкові' });
            }

            const existingUser = users.find(user => user.email === email);
            if (existingUser) {
                return res.status(400).json({ message: 'Користувач вже існує' });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = {
                id: userIdCounter++,
                email,
                password: hashedPassword,
                name,
                createdAt: new Date()
            };

            users.push(newUser);

            const token = jwt.sign(
                { userId: newUser.id, email: newUser.email },
                process.env.JWT_SECRET || 'fallback_secret',
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'Користувач успішно зареєстрований',
                token,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Помилка сервера' });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email та пароль обов\'язкові' });
            }

            const user = users.find(user => user.email === email);
            if (!user) {
                return res.status(400).json({ message: 'Невірний email або пароль' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Невірний email або пароль' });
            }

            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET || 'fallback_secret',
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Успішний вхід',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Помилка сервера' });
        }
    },

    getProfile: (req, res) => {
        const user = users.find(user => user.id === req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'Користувач не знайдений' });
        }

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt
            }
        });
    },

    getUsers: (req, res) => {
        res.json({
            total: users.length,
            users: users.map(user => ({
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt
            }))
        });
    }
};

module.exports = authController;
