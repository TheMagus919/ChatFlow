import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private apiUrl = `${environment.apiUrl}/subscriptions`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getPlans(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/plans`
    );
  }

  getCurrentPlan(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/current`,
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  createCheckout(priceId: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/create-checkout`,
      { priceId },
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  cancelSubscription(): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/cancel`,
      {},
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  createPortalSession(): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/portal`,
      {},
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`
    });
  }
}