import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})

export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  // ✅ PUBLIC METHODS para template
  show(message: string, type: 'success'|'error'|'info'|'warning' = 'info') {
    const toast: Toast = {
      id: Date.now(),
      message,
      type
    };
    
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([toast, ...currentToasts]);
    
    // Auto remove después 5s
    setTimeout(() => this.remove(toast.id), 5000);
  }

  // ✅ PUBLIC remove para template
  remove(id: number) {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(t => t.id !== id));
  }

  clearAll() {
    this.toastsSubject.next([]);
  }
}