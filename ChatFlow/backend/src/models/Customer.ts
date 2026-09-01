export interface Customer {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  email?: string;
  tags?: string[];
  status: 'new' | 'in_conversation' | 'closed'  | 'lost' | 'won';
  last_message_at?: string;
  created_at: string;
  updated_at: string;
  avatar?: string;
}

export interface CreateCustomer {
  name: string;
  phone: string;
  email?: string;
  tags?: string[];
  status?: 'new' | 'in_conversation' | 'closed'  | 'lost' | 'won';
  avatar?: string;
}