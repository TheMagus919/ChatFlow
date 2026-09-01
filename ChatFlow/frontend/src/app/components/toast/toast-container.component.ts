import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="toasts.length > 0">
      <div 
        *ngFor="let toast of toasts" 
        class="toast" 
        [ngClass]="'toast--' + toast.type"
        role="alert">
        
        <div class="toast__content">
          <i [ngClass]="getIcon(toast.type)" class="toast__icon"></i>
          <span class="toast__message">{{ toast.message }}</span>
        </div>
        
        <button class="toast__close" (click)="removeToast(toast.id)">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 400px;
    }

    .toast {
      background: white;
      border-radius: 16px;
      padding: 1.25rem 1.5rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
      border-left: 5px solid;
      display: flex;
      align-items: center;
      justify-content: space-between;
      animation: slideInRight 0.3s ease-out;
      backdrop-filter: blur(10px);
      min-height: 60px;
    }

    .toast--success { border-left-color: #10b981; }
    .toast--error { border-left-color: #ef4444; }
    .toast--warning { border-left-color: #f59e0b; }
    .toast--info { border-left-color: #3b82f6; }

    .toast__content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
    }

    .toast__icon {
      font-size: 1.25rem;
      width: 24px;
    }

    .toast--success .toast__icon { color: #10b981; }
    .toast--error .toast__icon { color: #ef4444; }
    .toast--warning .toast__icon { color: #f59e0b; }
    .toast--info .toast__icon { color: #3b82f6; }

    .toast__message {
      font-weight: 500;
      line-height: 1.4;
    }

    .toast__close {
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(0,0,0,0.1);
        color: #374151;
      }
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @media (max-width: 480px) {
      .toast-container {
        right: 10px;
        left: 10px;
        top: 10px;
      }
    }
  `]
})
export class ToastContainerComponent implements OnDestroy {
  toasts: Toast[] = [];
  subscription!: Subscription;

  constructor(private toastService: ToastService) {
    this.subscription = this.toastService.toasts$.subscribe((toasts: Toast[]) => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getIcon(type: string): string {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };
    return icons[type as keyof typeof icons] || 'fas fa-info-circle';
  }

  removeToast(id: number): void {
    this.toastService.remove(id);
  }
}