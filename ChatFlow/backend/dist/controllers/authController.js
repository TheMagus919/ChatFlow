"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = exports.AuthController = void 0;
const express_validator_1 = require("express-validator"); // ✅ FIXED
const authService_1 = require("../services/authService");
class AuthController {
    constructor() {
        this.authService = new authService_1.AuthService();
    }
    async register(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { email, password, name } = req.body;
            const user = await this.authService.register(email, password, name);
            res.status(201).json({
                message: 'User created successfully',
                user: { id: user.id, email: user.email, name: user.name }
            });
        }
        catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Email already exists' });
            }
            res.status(500).json({ error: error.message });
        }
    }
    async login(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.json(result);
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
    async me(req, res) {
        // ✅ Acceso seguro al user
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const user = await this.authService.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });
    }
    async logout(req, res) {
        return res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    }
    ;
}
exports.AuthController = AuthController;
// ✅ Export validators
exports.registerValidation = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password 6+ characters'),
    (0, express_validator_1.body)('name').notEmpty().trim().withMessage('Name required')
];
exports.loginValidation = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password required')
];
