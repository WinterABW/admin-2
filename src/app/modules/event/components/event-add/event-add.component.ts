import {Component, OnInit} from '@angular/core';
import {map, tap} from 'rxjs/operators';
import {EventService} from '../../services/event.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EventoService} from '../../state/evento.service';
import { CanalService } from 'src/app/services/canal.service';
import {environment} from '../../../../../environments/environment';

const baseUrl=environment.baseUrl

@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.component.html',
  styleUrls: ['./event-add.component.scss']
})
export class EventAddComponent implements OnInit {

  constructor(
    private eventService: EventService,
    private eventoService: EventoService,
    private router: Router,
    private snackbar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
  }

  save(event: any) {
    delete event.id;
    this.eventoService.add(event, {
      url: baseUrl + '/evento/'
    })
      .pipe(
        tap(x => {
          this.router.navigateByUrl('/events');
          this.snackbar.open('Evento creado correctamente');
        })
      )
      .subscribe();
  }

}
