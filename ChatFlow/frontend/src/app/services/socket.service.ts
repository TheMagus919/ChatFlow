import { Injectable } from "@angular/core";
import { io, Socket } from "socket.io-client";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class SocketService {
  private socket: Socket;

  constructor(private authService: AuthService) {
    this.socket = io("http://localhost:3000");
  }

  joinConversation(conversationId: number) {
    this.socket.emit("join_conversation", conversationId);
  }

  onNewMessage(callback: (msg: any) => void) {
    this.socket.on("new_message", callback);
  }

  joinUserRoom(userId: string) {
    this.socket.emit('joinUserRoom', userId);
  }

  leaveUserRoom() {
    const userId = this.authService.currentUser$;
    this.socket.emit('leaveUserRoom', userId);
  }

  // Listener para stats (AGREGAR)
  onStatsUpdate(callback: (data: any) => void) {
    this.socket.on('statsUpdate', callback);
  }
}