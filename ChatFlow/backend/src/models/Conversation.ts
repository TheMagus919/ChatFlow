export interface Conversation {
  id: number;
  customerId: number;
  lastMessage: string;
  lastMessageAt: Date;
  createdAt: Date;
  usersId: number;
}