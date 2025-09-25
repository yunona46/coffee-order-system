const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const authController = {
    async register(req, res) {
        try {
            console.log('=== REGISTRATION START ===');
            console.log('Request body:', req.body);

            const { email, password, name, firstName, lastName, phone } = req.body;

            // ДУЖЕ ПРОСТА ВАЛІДАЦІЯ - тільки email і password
            if (!email) {
                console.log('Missing email');
                return res.status(422).json({
                    success: false,
                    message: 'Email is required',
                    code: 'VALIDATION_ERROR'
                });
            }

            if (!password) {
                console.log('Missing password');
                return res.status(422).json({
                    success: false,
                    message: 'Password is required', 
                    code: 'VALIDATION_ERROR'
                });
            }

            console.log('Basic validation passed');

            // ВИЗНАЧАЄМО ІМ'Я - дуже гнучка логіка
            let finalFirstName = '';
            let finalLastName = '';

            if (name && name.trim()) {
                console.log('Using name field:', name);
                // Використовуємо поле name
                const nameParts = name.trim().split(/\s+/);
                finalFirstName = nameParts[0] || 'User';
                finalLastName = nameParts.slice(1).join(' ') || '';
            } else if (firstName) {
                console.log('Using firstName field:', firstName);
                // Використовуємо firstName/lastName
                finalFirstName = firstName;
                finalLastName = lastName || '';
            } else {
                console.log('No name provided, generating from email');
                // Генеруємо ім'я з email
                finalFirstName = email.split('@')[0] || 'User';
                finalLastName = '';
            }

            console.log('Final name:', { firstName: finalFirstName, lastName: finalLastName });

            // Перевірка чи існує користувач
            const existingUser = User.findByEmail(email);
            if (existingUser) {
                console.log('User already exists');
                return res.status(409).json({
                    success: false,
                    message: 'User with this email already exists',
                    code: 'USER_ALREADY_EXISTS'
                });
            }

            console.log('Creating new user...');

            // Хешування пароля
            const hashedPassword = await bcrypt.hash(password, 12);

            // Створення користувача
            const userData = {
                firstName: finalFirstName,
                lastName: finalLastName,
                email: email,
                password: hashedPassword,
                phone: phone || ''
            };

            const user = new User(userData);
            const savedUser = user.save();

            console.log('User created with ID:', savedUser.id);

            // Генерація JWT токена
            const token = jwt.sign(
                {
                    userId: savedUser.id,
                    email: savedUser.email,
                    role: savedUser.role
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            // Формування імені для відповіді
            const userName = savedUser.firstName + (savedUser.lastName ? ' ' + savedUser.lastName : '');

            console.log('Registration successful, sending response');

            // ВІДПОВІДЬ ВІДПОВІДНО ДО ДОКУМЕНТАЦІЇ
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user: {
                    id: savedUser.id,
                    email: savedUser.email,
                    name: userName
                },
                accessToken: token
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error during registration',
                error: error.message
            });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(422).json({
                    success: false,
                    message: 'Email and password are required'
                });
            }

            const user = User.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            user.lastLoginAt = new Date().toISOString();
            user.save();

            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            const userName = user.firstName + (user.lastName ? ' ' + user.lastName : '');

            res.json({
                success: true,
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    name: userName
                },
                accessToken: token
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error during login'
            });
        }
    },

    logout(req, res) {
        res.json({
            success: true,
            message: 'Logout successful'
        });
    },

    getProfile(req, res) {
        try {
            const user = User.findById(req.user.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const userName = user.firstName + (user.lastName ? ' ' + user.lastName : '');

            res.json({
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: userName,
                    phone: user.phone,
                    role: user.role
                }
            });

        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    async updateProfile(req, res) {
        try {
            const { name, phone } = req.body;
            const user = User.findById(req.user.userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            if (name) {
                const nameParts = name.split(/\s+/);
                user.firstName = nameParts[0] || user.firstName;
                user.lastName = nameParts.slice(1).join(' ') || user.lastName;
            }
            if (phone !== undefined) user.phone = phone;

            user.save();

            const userName = user.firstName + (user.lastName ? ' ' + user.lastName : '');

            res.json({
                success: true,
                message: 'Profile updated successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    name: userName,
                    phone: user.phone
                }
            });

        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while updating profile'
            });
        }
    }
};

module.exports = authController;
