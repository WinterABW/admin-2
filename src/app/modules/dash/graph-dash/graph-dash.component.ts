import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PubData } from '../dashboard/dashboard.component';


@Component({
  selector: 'app-graph-dash',
  templateUrl: './graph-dash.component.html',
  styleUrls: ['./graph-dash.component.scss']
})
export class GraphDashComponent implements OnInit, OnChanges {
  @Input() data: PubData;
  @Input() canalData: any;
  @Input() usersData: any;

  mv: { series: { data: number[]; name: string }[]; labels: any[] };
  md: { series: { data: number[]; name: string }[]; labels: any[] };
  mc: { series: { data: number[]; name: string }[]; labels: any[] };
  ml: { series: { data: number[]; name: string }[]; labels: any[] };
  cards: {
    color: string,
    label: string,
    number: any,
    icon: string
  }[];

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.buildCards();


  }

  ngOnInit(): void {
    this.buildCards();
  }

  private buildCards() {
    this.cards = [
      {
        color: 'blue',
        label: 'Registrados',
        number: this.usersData.total,
        icon: 'verified_user'
      },
      {
        color: 'green',
        label: 'Activos',
        number: this.usersData.active,
        icon: 'mood'
      },
      {
        color: 'red',
        label: 'No completados',
        number: this.usersData.incomplete,
        icon: 'mood_bad'
      },
      {
        color: 'orange',
        label: 'Desactivados',
        number: this.usersData.disabled,
        icon: 'person'
      },
      {
        color: 'indigo',
        label: 'Bajas',
        number: this.usersData.baja,
        icon: 'person'
      }
    ];
    this.mv = {
      labels: this.data.mas_vistas.map(row => row.nombre),
      series: [{
        name: 'Reproducciones',
        data: this.data.mas_vistas.map(row => row.cantidad_reproducciones)
      }]
    };
    this.md = {
      labels: this.data.mas_descargadas.map(row => row.nombre),
      series: [{
        name: 'Descargas',
        data: this.data.mas_descargadas.map(row => row.cantidad_descargas)
      }]
    };
    this.mc = {
      labels: this.data.mas_comentadas.map(row => row.nombre),
      series: [{
        name: 'Comentarios',
        data: this.data.mas_comentadas.map(row => row.cantidad_comentarios)
      }]
    };
    this.ml = {
      labels: this.data.mas_likes.map(row => row.nombre),
      series: [{
        name: 'Me gusta',
        data: this.data.mas_likes.map(row => row.cantidad_me_gusta)
      }]
    };

  }
}
