import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface AppNotification {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning';
  read: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly notificationsSubject = new BehaviorSubject<AppNotification[]>([
    {
      id: 'notification-100',
      title: 'Trial workspace converted',
      detail:
        'A Growth customer upgraded to Enterprise after the latest renewal cycle.',
      timestamp: '2 min ago',
      level: 'success',
      read: false,
    },
    {
      id: 'notification-101',
      title: 'Usage review required',
      detail:
        'API traffic moved above the alert threshold for one high-volume account.',
      timestamp: '18 min ago',
      level: 'warning',
      read: false,
    },
    {
      id: 'notification-102',
      title: 'Weekly digest ready',
      detail: 'The new operations summary is available for leadership review.',
      timestamp: 'Today',
      level: 'info',
      read: true,
    },
  ]);

  readonly notifications$ = this.notificationsSubject.asObservable();
  readonly unreadCount$ = this.notifications$.pipe(
    map((notifications) => notifications.filter((notification) => !notification.read).length),
  );

  markAllAsRead(): void {
    this.notificationsSubject.next(
      this.notificationsSubject.value.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  }

  markAsRead(notificationId: string): void {
    this.notificationsSubject.next(
      this.notificationsSubject.value.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              read: true,
            }
          : notification,
      ),
    );
  }
}
