"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authService_1 = require("../services/authService");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({
                error: 'Token de autenticación requerido'
            });
            return;
        }
        const [scheme, token] = authHeader.split(' ');
        if (scheme !== 'Bearer' || !token) {
            res.status(401).json({
                error: 'Formato de autorización inválido'
            });
            return;
        }
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET no está configurado');
            res.status(500).json({
                error: 'Error de configuración del servidor'
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded.userId || !decoded.email) {
            res.status(401).json({
                error: 'Token inválido'
            });
            return;
        }
        const authService = new authService_1.AuthService();
        const user = await authService.findById(decoded.userId);
        if (!user) {
            res.status(403).json({
                error: 'Usuario no encontrado'
            });
            return;
        }
        // Guardamos siempre la misma estructura.
        // A partir de ahora todo el backend debe utilizar req.user.userId.
        req.user = {
            userId: decoded.userId,
            email: decoded.email
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({
                error: 'Token expirado'
            });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                error: 'Token inválido'
            });
            return;
        }
        console.error('Error de autenticación:', error);
        res.status(500).json({
            error: 'Error interno de autenticación'
        });
    }
};
exports.authenticateToken = authenticateToken;