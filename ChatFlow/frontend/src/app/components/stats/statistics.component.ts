import {ChangeDetectorRef, Component, OnInit, ElementRef, ViewChild, HostListener} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration,ChartData,ChartType} from 'chart.js';
import {StatisticsService} from '../../services/statistics.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification.interface';
@Component({
  selector: 'app-statistics',

  standalone: true,

  imports: [
    CommonModule,
    BaseChartDirective,
    RouterLink
  ],

  templateUrl:
    './statistics.component.html',

  styleUrls:
    ['./statistics.component.scss']
})
export class StatisticsComponent
implements OnInit {
  
  stats: any;

  statusChartType:
  ChartType = 'doughnut';

  monthlyChartType:
  ChartType = 'bar';

  statusChartData:
  ChartData<'doughnut'> = {

    labels: [],

    datasets: [
      {
        data: []
      }
    ]

  };

  monthChartData:
  ChartData<'bar'> = {

    labels: [],

    datasets: [
      {
        data: [],
        label: 'Clientes'
      }
    ]

  };

  wonChartData:
  ChartData<'line'> = {

    labels: [],

    datasets: [
      {
        data: [],
        label: 'Ventas'
      }
    ]

  };

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
    private statisticsService:StatisticsService,
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
    this.loadDashboard();
  }

  loadDashboard(): void {

    this.statisticsService
      .getDashboard()
      .subscribe({

        next: (res) => {

          this.stats = res;
          console.log('STATS:', res);
          this.buildStatusChart();

          this.buildMonthlyChart();

          this.buildWonChart();
          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  buildStatusChart(): void {

    this.statusChartData = {

      labels: [

        'Nuevos',

        'En Conversación',

        'Ganados',

        'Perdidos',

        'Cerrados'

      ],

      datasets: [

        {

          data: [

            this.stats.newCustomers,

            this.stats.inConversation,

            this.stats.wonCustomers,

            this.stats.lostCustomers,

            this.stats.closedCustomers

          ]

        }

      ]

    };

  }

  buildMonthlyChart(): void {

    const months: Record<string, number> = {};

    this.stats.customers
      .forEach((customer: any) => {

        const date =
          new Date(
            customer.created_at
          );

        const key =
          date.toLocaleString(
            'es-AR',
            {
              month: 'short'
            }
          );

        months[key] =
          (months[key] || 0) + 1;

      });

    this.monthChartData = {

      labels:
        Object.keys(months),

      datasets: [

        {

          label:
            'Clientes Nuevos',

          data:
            Object.values(months)

        }

      ]

    };

  }

  buildWonChart(): void {

    const months:
    Record<string, number> = {};

    this.stats.customers
      .filter(
        (c: any) =>
          c.status === 'won'
      )

      .forEach((customer: any) => {

        const date =
          new Date(
            customer.updated_at
          );

        const key =
          date.toLocaleString(
            'es-AR',
            {
              month: 'short'
            }
          );

        months[key] =
          (months[key] || 0) + 1;

      });

    this.wonChartData = {

      labels:
        Object.keys(months),

      datasets: [

        {

          label:
            'Clientes Ganados',

          data:
            Object.values(months)

        }

      ]

    };

  }

  get conversionRate(): string {

    if (!this.stats)
      return '0';

    return (
      this.stats
        .conversionRate || 0
    ).toFixed(1);

  }

  public chartOptions: any = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      position: 'top'
    }
  }
};

  showLogoutModal = false;

  openLogoutModal(): void {
    this.showLogoutModal = true;
    this.disableScroll();
  }

  closeLogoutModal(): void {
    this.showLogoutModal = false;
    this.enableScroll()
  }

  confirmLogout(): void {
    this.enableScroll()
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