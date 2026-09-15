import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;

  constructor(
    private authService: AuthService
  ) {

    const token =
      this.authService.getToken();

    this.socket = io(
      environment.apiUrl.replace('/api', ''),
      {
        auth: {
          token
        },
        withCredentials: true
      }
    );

    this.socket.on(
      'connect_error',
      (error) => {

        console.error(
          '❌ Error de Socket.IO:',
          error.message
        );

      }
    );

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
    callback: (msg: any) => void
  ): void {

    this.socket.on(
      'new_message',
      callback
    );

  }


  joinUserRoom(
    userId: string
  ): void {

    this.socket.emit(
      'joinUserRoom',
      Number(userId)
    );

  }


  leaveUserRoom(): void {

    this.socket.emit(
      'leaveUserRoom'
    );

  }


  onStatsUpdate(
    callback: (data: any) => void
  ): void {

    this.socket.on(
      'stats_update',
      callback
    );

  }


  onTyping(
    callback: (data: any) => void
  ): void {

    this.socket.on(
      'typing',
      callback
    );

  }


  onStopTyping(
    callback: (data: any) => void
  ): void {

    this.socket.on(
      'stop_typing',
      callback
    );

  }


  emitTyping(
    conversationId: number
  ): void {

    this.socket.emit(
      'typing',
      conversationId
    );

  }


  emitStopTyping(
    conversationId: number
  ): void {

    this.socket.emit(
      'stop_typing',
      conversationId
    );

  }

}