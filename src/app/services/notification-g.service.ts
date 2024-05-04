import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { NotificationComponent } from '../common/notification/notification.component';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private snackBar: MatSnackBar
  ) {
  }

  open(type: string, msg: string) {
    this.snackBar.openFromComponent(NotificationComponent, {data: {type, msg}});
  }
}
