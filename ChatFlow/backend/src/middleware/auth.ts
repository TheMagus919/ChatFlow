import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/authService';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('🔐 Auth token exists:', !!token);  // DEBUG
    
    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    console.log('🔓 Decoded userId:', decoded.userId);  // DEBUG
    
    const authService = new AuthService();
    const user = await authService.findById(decoded.userId);
    
    if (!user) {
      return res.status(403).json({ error: 'User not found' });
    }
    
    // ✅ CRÍTICO
    (req as any).user = { 
      userId: decoded.userId, 
      email: decoded.email 
    };
    
    console.log('✅ User attached:', (req as any).user.userId);  // DEBUG
    (req as any).user = decoded;
    console.log('✅ User attached:', (req as any).user.userId);  // DEBUG
    next();
  } catch (error: any) {
    console.error('❌ Auth error:', error.message);
    res.status(403).json({ error: 'Invalid token' });
  }
};