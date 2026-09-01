export interface Notification {
  id: number;

  user_id: number;

  title: string;

  message: string;

  type: 'message' | 'customer' | 'conversation' | 'system';

  is_read: boolean;

  reference_id?: number;

  created_at: Date;
}
