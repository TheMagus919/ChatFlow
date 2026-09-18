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
        const [userResult] = await database_1.default.execute(`
      SELECT
        id,
        email,
        password,
        name,
        subscription,
        is_active,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
      `, [insertId]);
        if (!userResult[0]) {
            throw new Error('No se pudo recuperar el usuario creado');
        }
        return userResult[0];
    }
    async login(email, password) {
        const normalizedEmail = email.trim().toLowerCase();
        const [userResult] = await database_1.default.execute(`
      SELECT
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
      LIMIT 1
      `, [normalizedEmail]);
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
        const [userResult] = await database_1.default.execute(`
      SELECT
        id,
        email,
        name,
        subscription,
        is_active,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
      LIMIT 1
      `, [userId]);
        return userResult[0] || null;
    }
    async updateProfile(userId, data) {
        const normalizedEmail = data.email.trim().toLowerCase();
        const normalizedName = data.name.trim();
        const [existingUsers] = await database_1.default.execute(`
      SELECT id
      FROM users
      WHERE email = ?
        AND id <> ?
      LIMIT 1
      `, [
            normalizedEmail,
            userId
        ]);
        if (existingUsers.length > 0) {
            throw new Error('El email ya está registrado');
        }
        const [result] = await database_1.default.execute(`
      UPDATE users
      SET
        name = ?,
        email = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `, [
            normalizedName,
            normalizedEmail,
            userId
        ]);
        if (result.affectedRows === 0) {
            throw new Error('Usuario no encontrado');
        }
        const updatedUser = await this.findById(userId);
        if (!updatedUser) {
            throw new Error('Usuario no encontrado');
        }
        return updatedUser;
    }
    async changePassword(userId, currentPassword, newPassword) {
        const [userResult] = await database_1.default.execute(`
      SELECT
        id,
        password
      FROM users
      WHERE id = ?
      LIMIT 1
      `, [userId]);
        const user = userResult[0];
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        const passwordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!passwordValid) {
            throw new Error('La contraseña actual es incorrecta');
        }
        const samePassword = await bcryptjs_1.default.compare(newPassword, user.password);
        if (samePassword) {
            throw new Error('La nueva contraseña debe ser diferente a la actual');
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, SALT_ROUNDS);
        await database_1.default.execute(`
      UPDATE users
      SET
        password = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `, [
            hashedPassword,
            userId
        ]);
    }
}
exports.AuthService = AuthService;
/*import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

const SALT_ROUNDS = 12;

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está configurado');
}

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  subscription: 'free' | 'pro' | 'business';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface LoginResponse {
  user: {
    id: number;
    email: string;
    name: string;
    subscription: 'free' | 'pro' | 'business';
    is_active: boolean;
    created_at: Date;
  };
  token: string;
}

export class AuthService {

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<User> {

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [normalizedEmail]
    ) as any;

    if (existingUsers.length > 0) {
      throw new Error('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(
      password,
      SALT_ROUNDS
    );

    const [insertResult] = await pool.execute(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [
        normalizedEmail,
        hashedPassword,
        normalizedName
      ]
    );

    const insertId = (insertResult as any).insertId;

    const [userResult] = await pool.execute(
      `SELECT
        id,
        email,
        password,
        name,
        subscription,
        is_active,
        created_at,
        updated_at
       FROM users
       WHERE id = ?`,
      [insertId]
    ) as any;

    if (!userResult[0]) {
      throw new Error('No se pudo recuperar el usuario creado');
    }

    return userResult[0] as User;
  }

  async login(
    email: string,
    password: string
  ): Promise<LoginResponse> {

    const normalizedEmail = email.trim().toLowerCase();

    const [userResult] = await pool.execute(
      `SELECT
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
       LIMIT 1`,
      [normalizedEmail]
    ) as any;

    const user: User | undefined = userResult[0];

    if (!user || !user.is_active) {
      throw new Error('Credenciales inválidas');
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordValid) {
      throw new Error('Credenciales inválidas');
    }
    
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

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

  async findById(userId: number): Promise<User | null> {

    const [userResult] = await pool.execute(
      `SELECT
        id,
        email,
        name,
        subscription,
        is_active,
        created_at,
        updated_at
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [userId]
    ) as any;

    return userResult[0] || null;
  }
}
  */ 
