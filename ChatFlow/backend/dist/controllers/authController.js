"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = exports.AuthController = void 0;
const express_validator_1 = require("express-validator");
const authService_1 = require("../services/authService");
class AuthController {
    constructor() {
        this.authService = new authService_1.AuthService();
    }
    async register(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'Datos de registro inválidos',
                    details: errors.array()
                });
            }
            const { email, password, name } = req.body;
            const user = await this.authService.register(email, password, name);
            return res.status(201).json({
                message: 'Usuario creado correctamente',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            });
        }
        catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    error: 'El email ya está registrado'
                });
            }
            if (error.message === 'El email ya está registrado') {
                return res.status(409).json({
                    error: error.message
                });
            }
            console.error('Error en registro:', error);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }
    async login(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'Datos de login inválidos',
                    details: errors.array()
                });
            }
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            return res.status(200).json(result);
        }
        catch (error) {
            if (error.message === 'Credenciales inválidas') {
                return res.status(401).json({
                    error: 'Credenciales inválidas'
                });
            }
            console.error('Error en login:', error);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }
    async me(req, res) {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                error: 'No autenticado'
            });
        }
        try {
            const user = await this.authService.findById(userId);
            if (!user) {
                return res.status(404).json({
                    error: 'Usuario no encontrado'
                });
            }
            return res.status(200).json({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    subscription: user.subscription,
                    is_active: user.is_active,
                    created_at: user.created_at
                }
            });
        }
        catch (error) {
            console.error('Error obteniendo usuario:', error);
            return res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }
    async logout(_req, res) {
        return res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    }
}
exports.AuthController = AuthController;
exports.registerValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email válido requerido'),
    (0, express_validator_1.body)('password')
        .isString()
        .isLength({ min: 6, max: 128 })
        .withMessage('La contraseña debe tener entre 6 y 128 caracteres'),
    (0, express_validator_1.body)('name')
        .isString()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres')
];
exports.loginValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email válido requerido'),
    (0, express_validator_1.body)('password')
        .isString()
        .notEmpty()
        .withMessage('Contraseña requerida')
];
