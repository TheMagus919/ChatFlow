import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DashboardStats } from '../interfaces/statistics.interface';
@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private apiUrl =
    `${environment.apiUrl}/statistics`;

  constructor(
    private http: HttpClient
  ) {}

  getDashboard() {

    return this.http.get<DashboardStats>(
      this.apiUrl
    );

  }

}
