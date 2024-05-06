import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, tap } from 'rxjs/operators';
import { EventoService } from '../../state/evento.service';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss']
})
export class EventEditComponent implements OnInit {
  evento: any;

  constructor(
    private eventoService: EventoService,
    private router: Router,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.evento = this.route.snapshot.data['evento'][0];
  }

  ngOnInit(): void {
  }

  save(event: any) {
    this.eventoService.update(event.id, event)
      .pipe(
        tap(x => {
          this.router.navigateByUrl('/events');
          this.snackbar.open('Evento actualizado correctamente');
        }),
        catchError(err => {
          this.snackbar.open('Error al crear el evento');
          throw err;
        })
      )
      .subscribe();
  }
}

