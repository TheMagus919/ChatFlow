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
  user: Omit<User, 'password'>;
  token: string;
  refreshToken: string;
}