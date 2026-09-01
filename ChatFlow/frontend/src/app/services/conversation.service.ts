import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Conversation } from '../interfaces/conversation.interface';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  private http = inject(HttpClient);

  private apiUrl =
    `${environment.apiUrl}/conversations`;

  getConversations():
  Observable<Conversation[]> {

    return this.http.get<Conversation[]>(
      this.apiUrl
    );

  }

  getConversationById(id: number) {

    return this.http.get<Conversation>(
      `${this.apiUrl}/${id}`
    );

  }

createConversation(customerId: number) {

  return this.http.post<Conversation>(
    `${environment.apiUrl}/conversations`,
    {
      customerId
    }
  );

}
}