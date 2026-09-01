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

@Component({
  selector: 'app-pipeline',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    RouterLink
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

  unreadNotifications = 0;

  notifications: Notification[] = [];

  currentUser: {
    name: string;
    email: string;
  } = {
    name: '',
    email: ''
  };

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

      console.log(
        'CURRENT USER',
        user
      );

      if(user){
        this.currentUser = user;
        this.chatService
          .joinUserRoom(
            user.id
          );

      }

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
          }

          else if (status === 'in_conversation') {
            this.inProgressCustomers.push(customer);
          }

          else if (status === 'closed') {
            this.closedCustomers.push(customer);
          }

        });

        this.updateStats();

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
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