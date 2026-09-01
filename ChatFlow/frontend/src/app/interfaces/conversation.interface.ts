import { CustomerTag } from "./customerTag.interface";

export interface Conversation {
  id: number;

  customerId: number;

  status: 'new' | 'in_conversation' | 'closed';

  last_message: string;

  last_message_at: string | Date;

  updated_at: string;

  user_id: number;

  customer: {

    name: string;

    avatar?: string;

    phone?: string;

    status: 'new' | 'in_conversation' | 'closed'  | 'lost' | 'won';

    customerTags?: CustomerTag[];

  };
}