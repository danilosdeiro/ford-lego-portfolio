import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Notification, NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrl: './notification.css'
})
export class NotificationComponent implements OnInit, OnDestroy {
  notification: Notification | null = null;
  private subscription!: Subscription;
  private timer: any;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notification$.subscribe(notification => {
      this.notification = notification;
      clearTimeout(this.timer);
      if (notification) {
        this.timer = setTimeout(() => {
          this.close();
        }, 4000);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    clearTimeout(this.timer);
  }

  close() {
    this.notificationService.clear();
  }
}