import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DateRangeDialogComponent } from '../date-range-dialog/date-range-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { format } from 'date-fns';
import { DashboardService } from 'src/app/services/dashboard.service';

export interface PubData {
  reproducciones: number;
  publicadas: number;
  descargas: number;
  visitas: number;
  mas_vistas: any[];
  mas_descargadas: any[];
  mas_comentadas: any[];
  mas_likes: any[];
  mas_dislikes: any[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  user: any;
  isLoggin = true;
  isAuth = true;
  isMobile: boolean;

  usersData;
  publicationData: PubData = {
    reproducciones: 0,
    publicadas: 0,
    descargas: 0,
    visitas: 0,
    mas_vistas: [],
    mas_descargadas: [],
    mas_comentadas: [],
    mas_likes: [],
    mas_dislikes: [],
  };
  canalData: { noPublicados: number, publicados: number, masComentados: [], masSuscripciones: [], masReproducciones: [] };
  params = {};
  complete = false;
  cards: ({ number: any; color: string; icon: string; label: string } | { number: any; color: string; icon: string; label: string } | { number: any; color: string; icon: string; label: string } | { number: any; color: string; icon: string; label: string })[];

  constructor(
    public authService: AuthService,
    private dashService: DashboardService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.authService.user$.subscribe((res: any) => {
      if (res) {
        this.user = res;
        this.isLoggin = this.authService.isLoggedIn();
      } else {
        this.authService.getUserData().subscribe(
          (response: any) => {
            this.authService.setUserData(response);
          }
        );
      }
    });

    this.loadData();
  }

  loadData() {
    this.dashService.getResumenDatos(this.params).subscribe((response: any) => {
      const data = response.results[0];
      if (data.usuarios) {
        this.usersData = {
          total: data.usuarios.total_registrados,
          active: data.usuarios.total_activos,
          incomplete: data.usuarios.total_registro_incompleto,
          disabled: data.usuarios.total_desactivados,
          baja: data.usuarios.total_bajas,
        };
      }
      this.publicationData.publicadas = data.publicaciones.publicadas;
      this.publicationData.visitas = data.publicaciones.visitas;
      this.publicationData.reproducciones = data.publicaciones.reproducciones;
      this.publicationData.descargas = data.publicaciones.descargas;
      this.publicationData.mas_vistas = [...data.publicaciones.mas_vistas.results];
      this.publicationData.mas_descargadas = [...data.publicaciones.mas_descargadas.results];
      this.publicationData.mas_comentadas = [...data.publicaciones.mas_comentadas.results];
      this.publicationData.mas_likes = [...data.publicaciones.mas_likes.results];
      this.publicationData.mas_dislikes = [...data.publicaciones.mas_dislikes.results];

      this.canalData = { noPublicados: 0, masComentados: [], masReproducciones: [], masSuscripciones: [], publicados: 0 };
      this.canalData.noPublicados = data.canales.total_no_publicados;
      this.canalData.publicados = data.canales.publicados;
      this.canalData.masSuscripciones = data.canales.mas_suscripciones;
      this.canalData.masReproducciones = data.canales.mas_reproducciones;
      this.canalData.masComentados = data.canales.mas_comentarios;
      this.complete = true;
      this.buildCards();
    });
  }

  async filterByDate(days: number) {
    if (days > 0) {
      const date = new Date();
      date.setDate(date.getDate() - days);
      const fecha_inicial = format(date, 'yyyy-MM-dd');
      this.params = { fecha_inicial };
      this.loadData();
    } else if (days === 0) {
      this.params = null;
      this.loadData();
    } else {
      const dialogRef = this.dialog.open(DateRangeDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.fecha_inicial && result.fecha_final) {
          this.params = {
            fecha_inicial: format(result.fecha_inicial, 'yyyy-MM-dd'),
            fecha_final: format(result.fecha_final, 'yyyy-MM-dd')
          };
          this.loadData();

        }

      });
    }
  }
  private buildCards() {
    this.cards = [
      {
        color: 'red',
        label: 'Descargas',
        number: this.publicationData.descargas,
        icon: 'get_app'
      },
      {
        color: 'green',
        label: 'Publicaciones',
        number: this.publicationData.publicadas,
        icon: 'video_library'
      },
      {
        color: 'blue',
        label: 'Visitas',
        number: this.publicationData.visitas,
        icon: 'trending_up'
      },
      {
        color: 'indigo',
        label: 'Reproducciones',
        number: this.publicationData.reproducciones,
        icon: 'visibility'
      }
    ];
  }

  get permissions() {
    return this.user.groups.filter(group => group.name !== 'Usuario común').reduce((accumulator, currentValue) => accumulator.concat(currentValue.permissions), []);
  }

  public hasPermission(permission: string) {
    return this.permissions.findIndex(permiso => permiso.codename === permission) >= 0;
  }

  public isAdmin() {
    return this.user.groups.some(g => g.name === 'Administrador');
  }
}
