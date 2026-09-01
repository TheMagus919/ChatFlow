import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';  // ✅ FIXED
import { AuthService } from '../services/authService';

export class AuthController {
  private authService = new AuthService();

  async register(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name } = req.body;
      const user = await this.authService.register(email, password, name);
      
      res.status(201).json({
        message: 'User created successfully',
        user: { id: user.id, email: user.email, name: user.name }
      });
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async me(req: Request, res: Response) {
  // ✅ Acceso seguro al user
  const userId = (req as any).user?.userId;
  
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const user = await this.authService.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({ user });
}
async logout(
  req: Request,
  res: Response
){

  return res.status(200).json({
    success: true,
    message: 'Logout successful'
  });

};
}

// ✅ Export validators
export const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password 6+ characters'),
  body('name').notEmpty().trim().withMessage('Name required')
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
];