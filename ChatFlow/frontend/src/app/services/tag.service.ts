import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../components/tags/tags.component';
import { CustomerTag } from '../interfaces/customerTag.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private apiUrl = `${environment.apiUrl}/tags`;

  private http = inject(HttpClient);

  getAll(): Observable<any> {
  return this.http.get(`${this.apiUrl}/`);
}

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  
  getCustomerTags(customerId: number): Observable<CustomerTag[]> {
    return this.http.get<CustomerTag[]>(`${this.apiUrl}/${customerId}`);
  }

  //ABM de tags
  create(tag: Partial<Tag>): Observable<any> {
    return this.http.post(this.apiUrl, tag);
  }

  update(id: string, tag: Partial<Tag>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, tag);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}