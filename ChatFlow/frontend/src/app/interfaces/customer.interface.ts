export interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  status: 'new' | 'in_conversation' | 'closed'  | 'lost' | 'won';
  last_message_at?: string;
  created_at?: string;
  updated_at?: string;
  avatar?: string;
  customerTags?: {
    id: number;
    customerId: number;
    tagId: number;
    tag: {
      name: string;
      color: string;
    };
  }[];
}