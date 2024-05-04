import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  type = 'ok' || 'error' || 'notification';
  icon = 'check';

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {
  }

  ngOnInit() {
    switch (this.data.type) {
      case 'ok':
        this.icon = 'check';
        break;
      case 'error' :
        this.icon = 'error';
        break;
      case 'notification' :
        this.icon = 'notification_important';
        break;
      default:
        this.icon = 'ok';
    }
  }

}
