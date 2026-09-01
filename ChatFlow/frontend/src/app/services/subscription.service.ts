import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private apiUrl = `${environment.apiUrl}/subscriptions`;

  constructor(private http: HttpClient) {}

  getPlans(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/plans`);
  }

  getCurrentPlan(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/current`);
  }

  createCheckout(priceId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-checkout`, { priceId });
  }
}