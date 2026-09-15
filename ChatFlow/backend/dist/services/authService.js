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
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretfallback';
class AuthService {
    async register(email, password, name) {
        const hashedPassword = await bcryptjs_1.default.hash(password, SALT_ROUNDS);
        const [insertResult] = await database_1.default.execute('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [email, hashedPassword, name]);
        const insertId = insertResult.insertId;
        const [userResult] = await database_1.default.execute('SELECT * FROM users WHERE id = ?', [insertId]);
        return userResult[0];
    }
    async login(email, password) {
        const [userResult] = await database_1.default.execute('SELECT * FROM users WHERE email = ? AND is_active = true', [email]);
        const user = userResult[0];
        if (!user || !await bcryptjs_1.default.compare(password, user.password)) {
            throw new Error('Invalid credentials');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        // ✅ FIXED: Explicit object sin 'password'
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
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
    async findById(userId) {
        const [userResult] = await database_1.default.execute('SELECT id, email, name, subscription, is_active, created_at FROM users WHERE id = ?', [userId]);
        return userResult[0] || null;
    }
}
exports.AuthService = AuthService;
