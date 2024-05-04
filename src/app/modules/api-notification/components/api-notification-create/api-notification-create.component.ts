import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HotToastService } from '@ngneat/hot-toast';
import { environment } from 'src/environments/environment';
import { NotificationService } from '../../../../services/notification.service';

const baseUrlv2 = environment.baseUrlv2

@Component({
  selector: 'app-api-notification-create',
  templateUrl: './api-notification-create.component.html',
  styleUrls: ['./api-notification-create.component.scss']
})
export class ApiNotificationCreateComponent implements OnInit {

  constructor(
    private notificationService: NotificationService,
    private toast: HotToastService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  save({ users, msg, subject, body }) {
    let notification: any = {
      users,
      notification: {
        msg
      },
    };
    if (subject && body) {
      notification = {
        ...notification,
        mail: {
          subject,
          body
        }
      };
    }
    this.notificationService.add(notification, {
      url: baseUrlv2 + '/notificacion_api/',
    }).subscribe(created => {
      this.toast.success('Notificación creada correctamente');
      this.router.navigateByUrl('/notifications');
    });
  }
}
