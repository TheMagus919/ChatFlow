import { Injectable, inject } from '@angular/core';

import { HttpClient }
from '@angular/common/http';

import { Observable }
from 'rxjs';

import { environment }
from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private http = inject(HttpClient);

  private apiUrl =
    `${environment.apiUrl}/messages`;

  getMessages(
    conversationId: number
  ): Observable<any[]> {

    return this.http.get<any[]>(

      `${this.apiUrl}/conversation/${conversationId}`

    );

  }
  
  sendMessage(
    data: {

      content: string;

      customerId: number;

      conversationId: number;

    }

  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      data
    );

  }
  
}