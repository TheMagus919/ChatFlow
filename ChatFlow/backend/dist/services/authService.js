"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET no está configurado');
}
class AuthService {
    async register(email, password, name) {
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedName = name.trim();
        const [existingUsers] = await database_1.default.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [normalizedEmail]);
        if (existingUsers.length > 0) {
            throw new Error('El email ya está registrado');
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, SALT_ROUNDS);
        const [insertResult] = await database_1.default.execute('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [
            normalizedEmail,
            hashedPassword,
            normalizedName
        ]);
        const insertId = insertResult.insertId;
        const [userResult] = await database_1.default.execute(`SELECT
        id,
        email,
        password,
        name,
        subscription,
        is_active,
        created_at,
        updated_at
       FROM users
       WHERE id = ?`, [insertId]);
        if (!userResult[0]) {
            throw new Error('No se pudo recuperar el usuario creado');
        }
        return userResult[0];
    }
    async login(email, password) {
        const normalizedEmail = email.trim().toLowerCase();
        const [userResult] = await database_1.default.execute(`SELECT
        id,
        email,
        password,
        name,
        subscription,
        is_active,
        created_at,
        updated_at
       FROM users
       WHERE email = ?
       LIMIT 1`, [normalizedEmail]);
        const user = userResult[0];
        if (!user || !user.is_active) {
            throw new Error('Credenciales inválidas');
        }
        const passwordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!passwordValid) {
            throw new Error('Credenciales inválidas');
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email
        }, JWT_SECRET, {
            expiresIn: '7d'
        });
        const userWithoutPassword = {
            id: user.id,
            email: user.email,
            name: user.name,
            subscription: user.subscription,
            is_active: user.is_active,
            created_at: user.created_at
        };
        return {
            user: userWithoutPassword,
            token
        };
    }
    async findById(userId) {
        const [userResult] = await database_1.default.execute(`SELECT
        id,
        email,
        name,
        subscription,
        is_active,
        created_at,
        updated_at
       FROM users
       WHERE id = ?
       LIMIT 1`, [userId]);
        return userResult[0] || null;
    }
}
exports.AuthService = AuthService;
