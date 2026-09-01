import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Message } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket!: Socket;
  public messages$ = new BehaviorSubject<Message[]>([]);
  public connected$ = new BehaviorSubject(false);

  constructor(private authService: AuthService) {
    this.connect();
  }

  connect() {
    const token = this.authService.getToken();
    console.log(
      'TOKEN EN CONNECT:',
      token
    );
    if (!token) return;

    this.socket = io(environment.apiUrl.replace('/api', ''), {
      auth: { token }
    });

    this.socket.on('connect', () => {
      this.connected$.next(true);
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      this.connected$.next(false);
    });

    this.socket.on('new_message', (message: Message) => {
      const current = this.messages$.value;
      this.messages$.next([...current, message]);
    });
  }

  joinConversation(
    conversationId: number
  ): void {

    this.socket.emit(
      'join_conversation',
      conversationId
    );

  }

  leaveConversation(
    conversationId: number
  ): void {

    this.socket.emit(
      'leave_conversation',
      conversationId
    );

  }

  onNewMessage(
    callback: (message: any) => void
  ): void {

    this.socket.off('new_message');

    this.socket.on(
      'new_message',
      callback
    );

  }
  
  onNotification(
    callback: (notification: any) => void
  ): void {

    console.log(
      'Registrando listener'
    );

    this.socket.off(
      'new_notification'
    );

    this.socket.on(
      'new_notification',
      (notification) => {

        console.log(
          'Evento recibido desde socket'
        );

        callback(notification);

      }
    );

  }

  joinCustomer(customerId: number) {
    this.socket.emit('join_customer', customerId);
  }

  joinUserRoom(userId: number): void {

    console.log(
      'JOINING USER ROOM',
      userId
    );

    this.socket.emit(
      'joinUserRoom',
      userId
    );

  }
  sendMessage(data: any): void {

    this.socket.emit(
      'send_message',
      data
    );

  }

  disconnect(): void {

    if (this.socket) {

      this.socket.removeAllListeners();

      this.socket.disconnect();

    }

  }
}
