import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { AuthService } from '../services/authService';

export class AuthController {

  private authService = new AuthService();

  async register(
    req: Request,
    res: Response
  ): Promise<Response> {

    try {

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Datos de registro inválidos',
          details: errors.array()
        });
      }

      const {
        email,
        password,
        name
      } = req.body;

      const user = await this.authService.register(
        email,
        password,
        name
      );

      return res.status(201).json({
        message: 'Usuario creado correctamente',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });

    } catch (error: any) {

      if (
        error.code === 'ER_DUP_ENTRY'
      ) {
        return res.status(409).json({
          error: 'El email ya está registrado'
        });
      }

      if (
        error.message === 'El email ya está registrado'
      ) {
        return res.status(409).json({
          error: error.message
        });
      }

      console.error(
        'Error en registro:',
        error
      );

      return res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  }

  async login(
    req: Request,
    res: Response
  ): Promise<Response> {

    try {

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Datos de login inválidos',
          details: errors.array()
        });
      }

      const {
        email,
        password
      } = req.body;

      const result =
        await this.authService.login(
          email,
          password
        );

      return res.status(200).json(result);

    } catch (error: any) {

      if (
        error.message === 'Credenciales inválidas'
      ) {
        return res.status(401).json({
          error: 'Credenciales inválidas'
        });
      }

      console.error(
        'Error en login:',
        error
      );

      return res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  }

  async me(
    req: Request,
    res: Response
  ): Promise<Response> {

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'No autenticado'
      });
    }

    try {

      const user =
        await this.authService.findById(userId);

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

    } catch (error) {

      console.error(
        'Error obteniendo usuario:',
        error
      );

      return res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  }

  async updateProfile(
    req: Request,
    res: Response
  ): Promise<Response> {

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'No autenticado'
      });
    }

    try {

      const {
        name,
        email
      } = req.body;

      if (
        typeof name !== 'string' ||
        name.trim().length < 2 ||
        name.trim().length > 100
      ) {
        return res.status(400).json({
          error: 'El nombre debe tener entre 2 y 100 caracteres'
        });
      }

      if (
        typeof email !== 'string' ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          email.trim()
        )
      ) {
        return res.status(400).json({
          error: 'Email válido requerido'
        });
      }

      const user =
        await this.authService.updateProfile(
          userId,
          {
            name,
            email
          }
        );

      return res.status(200).json({
        message: 'Perfil actualizado correctamente',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          subscription: user.subscription,
          is_active: user.is_active,
          created_at: user.created_at
        }
      });

    } catch (error: any) {

      if (
        error.code === 'ER_DUP_ENTRY' ||
        error.message === 'El email ya está registrado'
      ) {
        return res.status(409).json({
          error: 'El email ya está registrado'
        });
      }

      if (
        error.message === 'Usuario no encontrado'
      ) {
        return res.status(404).json({
          error: error.message
        });
      }

      console.error(
        'Error actualizando perfil:',
        error
      );

      return res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  }

  async changePassword(
    req: Request,
    res: Response
  ): Promise<Response> {

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'No autenticado'
      });
    }

    try {

      const {
        currentPassword,
        newPassword
      } = req.body;

      if (
        typeof currentPassword !== 'string' ||
        !currentPassword.trim()
      ) {
        return res.status(400).json({
          error: 'La contraseña actual es obligatoria'
        });
      }

      if (
        typeof newPassword !== 'string' ||
        newPassword.length < 6 ||
        newPassword.length > 128
      ) {
        return res.status(400).json({
          error:
            'La nueva contraseña debe tener entre 6 y 128 caracteres'
        });
      }

      await this.authService.changePassword(
        userId,
        currentPassword,
        newPassword
      );

      return res.status(200).json({
        message: 'Contraseña actualizada correctamente'
      });

    } catch (error: any) {

      if (
        error.message ===
        'La contraseña actual es incorrecta'
      ) {
        return res.status(401).json({
          error: error.message
        });
      }

      if (
        error.message ===
        'La nueva contraseña debe ser diferente a la actual'
      ) {
        return res.status(400).json({
          error: error.message
        });
      }

      if (
        error.message === 'Usuario no encontrado'
      ) {
        return res.status(404).json({
          error: error.message
        });
      }

      console.error(
        'Error cambiando contraseña:',
        error
      );

      return res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  }

  async logout(
    _req: Request,
    res: Response
  ): Promise<Response> {

    return res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  }
}

export const registerValidation = [

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email válido requerido'),

  body('password')
    .isString()
    .isLength({
      min: 6,
      max: 128
    })
    .withMessage(
      'La contraseña debe tener entre 6 y 128 caracteres'
    ),

  body('name')
    .isString()
    .trim()
    .isLength({
      min: 2,
      max: 100
    })
    .withMessage(
      'El nombre debe tener entre 2 y 100 caracteres'
    )

];

export const loginValidation = [

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage(
      'Email válido requerido'
    ),

  body('password')
    .isString()
    .notEmpty()
    .withMessage(
      'Contraseña requerida'
    )

];
