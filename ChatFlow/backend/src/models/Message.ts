export type MessageDirection = "incoming" | "outgoing";
export type MessageStatus = "sent" | "delivered" | "read";

export interface Message {
  id: number;
  content: string;
  direction: MessageDirection;
  status: MessageStatus;
  customerId: number;
  conversationId: number;
  createdAt: Date;
}

//para crear un mensaje
export interface SendMessageDTO {
  content: string;
  customerId: number;
}

//para respuesta
export interface MessageResponseDTO {
  id: number;
  content: string;
  direction: "incoming" | "outgoing";
  status: "sent" | "delivered" | "read";
  createdAt: Date;
}

export interface IncomingMessageDTO {

  content: string;

  customerId: number;

  conversationId: number;
}