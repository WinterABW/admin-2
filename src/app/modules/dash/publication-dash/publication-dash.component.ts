import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { listAnimation } from 'src/app/common/animations/animations';
import { PubData } from 'src/app/common/interfaces/Pubdata';
import { Publicacion } from 'src/app/models/publicacion';
import { User } from 'src/app/models/user';
import { PublicationService } from 'src/app/services/publication.service';

import { SubscriptionService } from 'src/app/services/subscription.service';
import { UsuariosService } from 'src/app/services/user.service';
import { CommentService } from '../../comentario/services/comment.service';

@Component({
  selector: 'app-publication-dash',
  templateUrl: './publication-dash.component.html',
  styleUrls: ['./publication-dash.component.scss'],
  animations: [listAnimation]
})
export class PublicationDashComponent implements OnInit {
  @Input() data: PubData;
  @Input() cards: {
    color: string,
    label: string,
    number: any,
    icon: string
  }[];
  comments: Observable<any[]>;
  users: Observable<User[]>;
  publicaciones: Observable<Publicacion[]>;
  subscriptions: Observable<any[]>;


  constructor(
    public authService: AuthService,
    private commentService: CommentService,
    private publicationService: PublicationService,
    private subscriptionService: SubscriptionService,
    private usuariosService: UsuariosService
  ) {
    this.loadComentarios();
    this.loadPublicaciones();
    this.loadUsuarios();
  }

  ngOnInit() {
  }

  private loadComentarios() {
    this.comments = this.commentService.get_comentarios({
      page: 1,
      page_size: 5
    }).pipe(
      map((response: any) => response.results)
    );
  }

  private loadUsuarios() {
    this.users = this.usuariosService.getAll({
      page: 1,
      page_size: 5
    }).pipe(
      map((response: any) => response.results)
    );
  }

  private loadPublicaciones() {
    this.publicaciones = this.publicationService.getAll({
      page: 1,
      page_size: 5
    }).pipe(
      map((response: any) => response.results)
    );
  }

  messages = [
    {
      from: 'Nirav joshi (nbj@gmail.com)',
      image: 'assets/images/users/1.jpg',
      subject: 'Material angular',
      content: 'This is the material angular template'
    },
    {
      from: 'Sunil joshi (sbj@gmail.com)',
      image: 'assets/images/users/2.jpg',
      subject: 'Wrappixel',
      content: 'We have wrappixel launched'
    },
    {
      from: 'Vishal Bhatt (bht@gmail.com)',
      image: 'assets/images/users/3.jpg',
      subject: 'Task list',
      content: 'This is the latest task hasbeen done'
    }
  ];
}
