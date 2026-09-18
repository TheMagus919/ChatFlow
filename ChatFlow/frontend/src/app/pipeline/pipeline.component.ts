import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  HostListener
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  DragDropModule
} from '@angular/cdk/drag-drop';

import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';

import { PipelineCustomer } from '../interfaces/pipeline.interface';
import { ConversationsComponent } from '../components/conversation/conversation.component';
import { NotificationService } from '../services/notification.service';
import { Notification } from '../interfaces/notification.interface';
import { ChatService } from '../services/chat.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-pipeline',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss']
})

export class PipelineComponent implements OnInit {

  newCustomers: PipelineCustomer[] = [];
  inProgressCustomers: PipelineCustomer[] = [];
  closedCustomers: PipelineCustomer[] = [];

  newLeads = 0;
  inProgress = 0;
  closed = 0;

  showNotifications = false;

  showProfileModal = false;
  editProfileMode = false;

  profileForm = {
    name: '',
    email: ''
  };

  profileLoading = false;
  profileMessage = '';
  profileError = '';

  changePasswordMode = false;

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  passwordLoading = false;
  passwordMessage = '';
  passwordError = '';
  unreadNotifications = 0;

  notifications: Notification[] = [];

  currentUser: {
    id: number;
    name: string;
    email: string;
    subscription: 'free' | 'pro' | 'business';
  } = {
    id: 0,
    name: '',
    email: '',
    subscription: 'free'
  };

  subscriptionPlan = 'free';
  subscriptionStatus = 'inactive';
  customersLimit = 10;
  customersUsed = 0;
  renewalDate: string | null = null;
  subscriptionLoading = false;
  private apiUrl = `${environment.apiUrl}/customers`;
  
  @ViewChild('notificationsContainer')
  notificationsContainer!: ElementRef;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private notificationService: NotificationService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
    .subscribe(user => {
      console.log('CURRENT USER', user);

      if (!user || !user.id) {
        return;
      }

      this.currentUser = user;

      this.chatService.joinUserRoom(user.id);
    });
    this.loadPipeline();
    this.loadNotifications();
    this.listenNotifications();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(
    event: MouseEvent
  ): void {

    if (!this.showNotifications) {
      return;
    }

    const clickedInside =
      this.notificationsContainer
        ?.nativeElement
        .contains(event.target);

    if (!clickedInside) {

      this.showNotifications = false;

      this.cdr.detectChanges();

    }

  }

  trackByFn(index: number, customer: PipelineCustomer): number {
    return customer.id || index;
  }
  loadPipeline(): void {
  const token = this.authService.getToken();

  this.http.get<any[]>(
    `${this.apiUrl}/pipeline`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  .subscribe({
    next: (customers) => {

      this.newCustomers = [];
      this.inProgressCustomers = [];
      this.closedCustomers = [];

      customers.forEach((customer) => {
        const status = customer.status?.toLowerCase();

        if (status === 'new') {
          this.newCustomers.push(customer);
        } else if (status === 'in_conversation') {
          this.inProgressCustomers.push(customer);
        } else if (status === 'closed') {
          this.closedCustomers.push(customer);
        }
      });
      this.customersUsed =
        this.newCustomers.length +
        this.inProgressCustomers.length +
        this.closedCustomers.length;
      this.updateStats();
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('PIPELINE ERROR:', err);
    }
  });
}
  drop(event: CdkDragDrop<PipelineCustomer[]>): void {

    if (event.previousContainer === event.container) {

      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

    } else {

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const customerId =
        event.container.data[event.currentIndex].id;

      const newStatus =
        this.getStatusFromContainer(event.container.id);

      this.updateCustomerStatus(customerId, newStatus);
    }

    this.updateStats();

    this.cdr.detectChanges();
  }

  openChat(customerId: number): void {

    this.router.navigate([
      '/conversations',
      customerId
    ]);

  }

  noReturnPredicate = (
    drag: CdkDrag,
    drop: CdkDropList
  ): boolean => {
    return true;
  };

  private getStatusFromContainer(
    containerId: string
  ): 'new' | 'in_conversation' | 'closed' {

    if (containerId.includes('new')) {
      return 'new';
    }

    if (containerId.includes('progress')) {
      return 'in_conversation';
    }

    return 'closed';
  }

  private updateCustomerStatus(
    customerId: number,
    status: string
  ): void {

    this.http.patch(
      `${this.apiUrl}/${customerId}/status`,
      { status },
      {
        headers: {
          Authorization:
            `Bearer ${this.authService.getToken()}`
        }
      }
    )
    .subscribe({
      next: () => console.log('Status updated'),
      error: (err) => console.error(err)
    });

  }

  private updateStats(): void {

    this.newLeads =
      this.newCustomers.length;

    this.inProgress =
      this.inProgressCustomers.length;

    this.closed =
      this.closedCustomers.length;
  }

  showLogoutModal = false;

  openLogoutModal(): void {
    this.showLogoutModal = true;
    this.disableScroll();
  }

  closeLogoutModal(): void {
    this.showLogoutModal = false;
    this.enableScroll();
  }

  confirmLogout(): void {
    this.enableScroll();
    this.closeLogoutModal();

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);

  }

  //NOTIFICACIONES Y PERFIL USUARIO
  goToPricing(): void {
    this.router.navigate(['/pricing']);
  }
  toggleNotifications(): void {
    this.showNotifications =
      !this.showNotifications;
  }

  openProfileModal(): void {
    this.profileLoading = true;
    this.profileError = '';
    this.profileMessage = '';
    this.authService.getMe().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadCurrentSubscription();
        this.profileForm = {
          name: user.name,
          email: user.email
        };

        this.editProfileMode = false;
        this.profileLoading = false;

        this.showProfileModal = true;
        this.disableScroll();

        this.cdr.detectChanges();
      },

      error: (err) => {
        this.profileLoading = false;

        this.profileError =
          err?.error?.message ||
          'No se pudieron cargar los datos del perfil.';

        this.showProfileModal = true;
        this.disableScroll();

        this.cdr.detectChanges();
      }
    });
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
    this.enableScroll();
  }
  startEditProfile(): void {
    this.profileForm = {
      name: this.currentUser.name,
      email: this.currentUser.email
    };

    this.editProfileMode = true;
    this.profileMessage = '';
    this.profileError = '';
  }

  cancelEditProfile(): void {
    this.profileForm = {
      name: this.currentUser.name,
      email: this.currentUser.email
    };

    this.editProfileMode = false;
    this.profileMessage = '';
    this.profileError = '';
  }

  saveProfile(): void {
    const name = this.profileForm.name.trim();
    const email = this.profileForm.email.trim();

    if (name.length < 2) {
      this.profileError = 'El nombre debe tener al menos 2 caracteres.';
      this.profileMessage = '';
      return;
    }

    if (name.length > 100) {
      this.profileError = 'El nombre no puede superar los 100 caracteres.';
      this.profileMessage = '';
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.profileError = 'Ingresá un email válido.';
      this.profileMessage = '';
      return;
    }

    this.profileLoading = true;
    this.profileError = '';
    this.profileMessage = '';

    this.authService.updateProfile(name, email).subscribe({
      next: (user) => {
        this.currentUser = user;

        this.profileForm = {
          name: user.name,
          email: user.email
        };

        this.editProfileMode = false;
        this.profileLoading = false;
        this.profileMessage = 'Perfil actualizado correctamente.';

        this.cdr.detectChanges();
      },

      error: (err) => {
        this.profileLoading = false;

        this.profileError =
          err?.error?.message ||
          'No se pudo actualizar el perfil.';

        this.cdr.detectChanges();
      }
    });
  }

  openChangePassword(): void {
    this.changePasswordMode = true;

    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    this.passwordMessage = '';
    this.passwordError = '';
  }

  cancelChangePassword(): void {
    this.changePasswordMode = false;

    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    this.passwordMessage = '';
    this.passwordError = '';
  }

  savePassword(): void {
    const currentPassword =
      this.passwordForm.currentPassword.trim();

    const newPassword =
      this.passwordForm.newPassword.trim();

    const confirmPassword =
      this.passwordForm.confirmPassword.trim();

    this.passwordError = '';
    this.passwordMessage = '';

    if (!currentPassword) {
      this.passwordError =
        'Ingresá tu contraseña actual.';
      return;
    }

    if (newPassword.length < 6) {
      this.passwordError =
        'La nueva contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (newPassword !== confirmPassword) {
      this.passwordError =
        'Las contraseñas nuevas no coinciden.';
      return;
    }

    if (currentPassword === newPassword) {
      this.passwordError =
        'La nueva contraseña debe ser diferente a la actual.';
      return;
    }

    this.passwordLoading = true;

    this.authService
      .changePassword(currentPassword, newPassword)
      .subscribe({
        next: () => {
          this.passwordLoading = false;

          this.passwordMessage =
            'Contraseña actualizada correctamente.';

          this.passwordForm = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          };

          this.cdr.detectChanges();
        },

        error: (err) => {
          this.passwordLoading = false;

          this.passwordError =
            err?.error?.message ||
            'No se pudo cambiar la contraseña.';

          this.cdr.detectChanges();
        }
      });
  }

  loadCurrentSubscription(): void {
    this.subscriptionLoading = true;

    this.http.get<any>(
      `${environment.apiUrl}/subscriptions/current`,
      {
        headers: {
          Authorization: `Bearer ${this.authService.getToken() || ''}`
        }
      }
    ).subscribe({
      next: (response) => {
        this.subscriptionPlan = response.plan || 'free';
        this.subscriptionStatus = response.status || 'inactive';
        this.customersLimit = Number(response.customersLimit) || 10;
        this.renewalDate = response.renewalDate || null;
        this.subscriptionLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.subscriptionLoading = false;
        this.subscriptionPlan = this.currentUser.subscription || 'free';
        this.customersLimit = 10;
        this.cdr.detectChanges();
      }
    });
  }

  get subscriptionPlanName(): string {
    switch (this.subscriptionPlan) {
      case 'pro':
        return 'Pro';

      case 'business':
        return 'Business';

      default:
        return 'Gratis';
    }
  }

  get customersUsagePercentage(): number {
    if (this.customersLimit <= 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.round((this.customersUsed / this.customersLimit) * 100)
    );
  }

  get subscriptionStatusName(): string {
    switch (this.subscriptionStatus) {
      case 'active':
        return 'Activa';

      case 'cancelled':
        return 'Cancelada';

      case 'past_due':
        return 'Pago pendiente';

      case 'inactive':
        return 'Sin suscripción';

      default:
        return this.subscriptionStatus;
    }
  }

  get formattedRenewalDate(): string {
    if (!this.renewalDate) {
      return '';
    }

    const date = new Date(this.renewalDate);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  get userInitials(): string {
    return this.currentUser.name
      ?.split(' ')
      .map(x => x[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  loadNotifications(): void {
    this.notificationService
      .getNotifications()
      .subscribe({
        next: (notifications: Notification[]) => {
          this.notifications = notifications;
          this.unreadNotifications =
            notifications.filter(
              notification => !notification.is_read
            ).length;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  markAllNotificationsRead(): void {
    this.notificationService
      .markAllAsRead()
      .subscribe({
        next: () => {
          this.notifications =
            this.notifications.map(
              notification => ({
                ...notification,
                is_read: true
              })
            );
          this.unreadNotifications = 0;
          this.cdr.detectChanges();
        }
      });
  }

  markNotificationRead(
  notification: Notification
): void {

  if (notification.is_read) {
    return;
  }

  this.notificationService
      .markAsRead(notification.id)
      .subscribe({

        next: () => {

          notification.is_read = true;

          this.unreadNotifications =
            this.notifications.filter(
              n => !n.is_read
            ).length;

          this.cdr.detectChanges();

        },

        error: err => {
          console.error(err);
        }

      });

  }

  openNotification(
    notification: Notification
  ): void {

    this.markNotificationRead(
      notification
    );
    if (
      notification.type === 'message'
      &&
      notification.reference_id
    ) {

      this.router.navigate([
        '/conversations',
        notification.reference_id
      ]);
    }
  }

  private disableScroll(): void {
    document.body.style.overflow = 'hidden';
  }

  private enableScroll(): void {
    document.body.style.overflow = 'auto';
  }

  private listenNotifications(): void {
  console.log('LISTENER REGISTRADO');
  this.chatService.onNotification(

    (notification) => {

      console.log(
        '🔔 SOCKET NOTIFICATION',
        notification
      );
      console.log(
        'ARRAY ANTES',
        this.notifications.length
      );
      this.notifications = [
        notification,
        ...this.notifications
      ];
      this.unreadNotifications++;
      console.log(
        'ARRAY DESPUES',
        this.notifications.length
      );
      this.cdr.detectChanges();

    }

  );

}
}