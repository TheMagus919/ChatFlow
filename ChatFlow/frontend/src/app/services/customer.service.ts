import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Customer } from '../interfaces/customer.interface';
import { CustomerTag } from '../interfaces/customerTag.interface';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {
  private apiUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) {}

  getCustomers(
    search = '',
    status = 'all'
  ): Observable<Customer[]> {

    let params =
      new HttpParams();

    params =
      params.set(
        'search',
        search
      );

    params =
      params.set(
        'status',
        status
      );

    return this.http.get<Customer[]>(
      this.apiUrl,
      { params }
    );

  }

  getById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  create(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  update(id: number, customer: Partial<Customer>): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Pipeline
  getByStatus(status?: string): Observable<Customer[]> {
    const params = status ? { status } : undefined;
    return this.http.get<Customer[]>(`${this.apiUrl}/pipeline`, { params });
  }

  updateStatus(id: number, status: Customer['status']): Observable<Customer> {
    return this.http.patch<Customer>(`${this.apiUrl}/${id}/status`, { status });
  }

  // Tags
  assignTags( id: number, tagIds: number[] ): Observable<Customer> {
  return this.http.post<Customer>(`${this.apiUrl}/${id}/tags`,{ tagIds });
  }

  updateTags(id: number,tagIds: string[]): Observable<any> {
  return this.http.post(`${this.apiUrl}/${id}/tags`,{ tagIds });
  }

  getCustomerTags(customerId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/${customerId}/tags`);
  }
  
  // Search by phone
  findByPhone(phone: string): Observable<Customer | null> {
    return this.http.get<Customer | null>(`${this.apiUrl}/phone/${phone}`);
  }
}