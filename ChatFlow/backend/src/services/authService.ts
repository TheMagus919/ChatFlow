import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretfallback';

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
  async register(email: string, password: string, name: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    const [insertResult] = await pool.execute(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name]
    );

    const insertId = (insertResult as any).insertId;
    
    const [userResult] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [insertId]
    ) as any;

    return userResult[0] as User;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const [userResult] = await pool.execute(
      'SELECT * FROM users WHERE email = ? AND is_active = true',
      [email]
    ) as any;
    const user: User = userResult[0];
    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

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

  logout(): void {
    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'user'
    );

  }

  async findById(userId: number): Promise<User | null> {
    const [userResult] = await pool.execute(
      'SELECT id, email, name, subscription, is_active, created_at FROM users WHERE id = ?',
      [userId]
    ) as any;

    return userResult[0] || null;
  }
}