import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastService } from './toast.service';
import { Notification } from '../interfaces/notification.interface';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = environment.apiUrl + '/notifications';
  constructor(
    private http: HttpClient,
    private toast: ToastService
  ) {}

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl);
  }

  create(userId: number, title: string, message: string): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl,{ userId, title, message });
  }

  showNotification( title: string, message: string ): void { this.toast.show(`${title}: ${message}`,'info');
  }

  markAllAsRead() {
    return this.http.patch(`${this.apiUrl}/read-all`,{});
  }

  markAsRead(notificationId: number) {
    return this.http.patch(`${this.apiUrl}/${notificationId}/read`,{});
  }
}