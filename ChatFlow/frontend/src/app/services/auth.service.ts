import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: number;
  email: string;
  name: string;
  subscription: 'free' | 'pro' | 'business';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // ✅ FIXED: Solo browser
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      if (token) {
        this.decodeTokenAndSetUser(token);
      }
    }
  }

  // ✅ FIXED: Safe localStorage
  private getLocalStorageItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setLocalStorageItem(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }

  private removeLocalStorageItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

  login(email: string, password: string): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/login`,
      { email, password }
    ).pipe(

      tap(response => {

        this.setToken(response.token);

        localStorage.setItem(
          'chatflow_user',
          JSON.stringify(response.user)
        );

        this.currentUserSubject.next(
          response.user
        );

      })

    );

  }

  register(
    name: string,
    email: string,
    password: string
  ): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/register`,
      {
        name,
        email,
        password
      }
    );

  }
  
  getToken(): string | null {
    const token = this.getLocalStorageItem('chatflow_token');
    console.log('🔑 TOKEN:', token ? 'EXISTS' : 'NULL');  // ✅ DEBUG
    return this.getLocalStorageItem('chatflow_token');
  }

  isAuthenticated(): boolean {
    const isAuth = !!this.getToken();
  console.log('🔐 isAuthenticated:', isAuth);  // ✅ DEBUG
  return isAuth;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  private setToken(token: string): void {
    this.setLocalStorageItem('chatflow_token', token);
  }

  logout(): Observable<any> {

    this.removeLocalStorageItem(
      'chatflow_token'
    );

    this.removeLocalStorageItem(
      'chatflow_user'
    );

    this.currentUserSubject.next(null);

    return this.http.post(
      `${environment.apiUrl}/auth/logout`,
      {}
    );

  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`
    });
  }

  private decodeTokenAndSetUser(
    token: string
  ): void {

    try {

      const savedUser =
        localStorage.getItem(
          'chatflow_user'
        );

      if (savedUser) {

        this.currentUserSubject.next(
          JSON.parse(savedUser)
        );

        return;
      }

      const payload =
        JSON.parse(
          atob(token.split('.')[1])
        );

      this.currentUserSubject.next({

        id: payload.userId,

        email: payload.email,

        name: '',

        subscription: 'free'

      });

    }
    catch {

      this.logout();

    }

  }
}