import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/authService';

interface JwtPayload {
  userId: number;
  email: string;
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as JwtPayload;

    if (!decoded.userId || !decoded.email) {
      res.status(401).json({
        error: 'Token inválido'
      });
      return;
    }

    const authService = new AuthService();

    const user = await authService.findById(decoded.userId);

    if (!user) {
      res.status(403).json({
        error: 'Usuario no encontrado'
      });
      return;
    }

    if (!user.is_active) {
      res.status(403).json({
        error: 'Usuario desactivado'
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

  } catch (error) {

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: 'Token expirado'
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
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