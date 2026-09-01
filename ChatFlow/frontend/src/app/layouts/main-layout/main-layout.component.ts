// src/app/layouts/main-layout/main-layout.component.ts - REEMPLAZAR
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, LoadingSpinnerComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  // ✅ PUBLIC para template
  public readonly toastService = inject(ToastService);
  public readonly authService = inject(AuthService);

  public isDarkMode = false;
  public isSidebarOpen = true;
  public user$ = this.authService.currentUser$;  // ✅ Quitar (as any)

  constructor() {
    // ✅ Cargar dark mode desde localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    this.isDarkMode = savedDarkMode === 'true';
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark-mode', this.isDarkMode);
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout(event?: Event) {
    event?.preventDefault();  // ✅ Prevenir navegación
    this.authService.logout();
    this.toastService.show('Sesión cerrada', 'success');
  }

  // ✅ trackBy para toasts
  trackByToastId(index: number, toast: any): number {
    return toast.id;
  }

  // ✅ Test method
  testToast() {
    this.toastService.show('¡Test toast funcionando!', 'success');
  }
}