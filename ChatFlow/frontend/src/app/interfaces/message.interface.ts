export interface Message {
  id: number;

  content: string;

  customerId: number;

  conversationId: number;

  direction: 'incoming' | 'outgoing';

  status: 'sent' | 'delivered' | 'read';

  created_at: Date;

  delivered_at?: Date | null;

  read_at?: Date | null;
}