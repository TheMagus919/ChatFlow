import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer } from '../../interfaces/customer.interface';
import { CustomerService } from '../../services/customer.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification.interface';

@Component({
  selector: 'app-customer-list',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl:
    './customers.component.html',

  styleUrls: [
    './customers.component.scss'
  ]
})
export class CustomerListComponent
implements OnInit {

  customers: Customer[] = [];

  search = '';

  selectedStatus = 'all';

  showNotifications = false;
  
  showProfileModal = false;
  
  unreadNotifications = 0;
  
  notifications: Notification[] = [];
  
  currentUser: {
      name: string;
      email: string;
    } = {
      name: '',
      email: ''
    };
  
  @ViewChild('notificationsContainer')
  notificationsContainer!: ElementRef;

  constructor(
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
    .subscribe(user => {
      if (user) {
        this.currentUser = user;
      }
    });
    this.loadNotifications();
    this.loadCustomers();
  }

  loadCustomers(): void {

    this.customerService
      .getCustomers(
        this.search,
        this.selectedStatus
      )
      .subscribe({

        next: (res) => {

          this.customers = res;
          this.cdr.detectChanges();
        }

      });

  }

  getStatusLabel(status: string): string {

    const labels: Record<string, string> = {

      new: 'Nuevo',

      in_conversation: 'En conversación',

      won: 'Vendido',

      lost: 'Perdido',

      closed: 'Cerrado'

    };

    return labels[status] || status;

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

  //NOTIFICACIONES Y USUARIO
  toggleNotifications(): void {
    this.showNotifications =
      !this.showNotifications;
  }

  openProfileModal(): void {
    this.showProfileModal = true;
    this.disableScroll();
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
    this.enableScroll();
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
}