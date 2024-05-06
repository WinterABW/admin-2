import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { UnauthGuard } from './guards/unauth.guard';
import { LoginComponent } from './components/login/login.component';
import { TermsComponent } from './common/components/terms/terms.component';
import { AboutComponent } from './common/components/about/about.component';

export const AppRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      }, {
        path: 'dash',
        loadChildren: () => import('./modules/dash/dash.module').then(m => m.DashModule),
      },
      {
        path: 'sales',
        loadChildren: () => import('./modules/sales/sales.module').then(m => m.SalesModule),
      },
      {
        path: 'incomes',
        loadChildren: () => import('./modules/incomes/incomes.module').then(m => m.Incomes),
      },
      {
        path: 'publicaciones',
         loadChildren: () => import('./modules/publicacion/publicacion.module').then(m => m.PublicacionModule),
      },
      {
        path: 'series',
        loadChildren: () => import('./modules/serie/serie.module').then(m => m.SerieModule),
      },
      {
        path: 'playlist',
        loadChildren: () => import('./modules/playlist/playlist.module').then(m => m.PlaylistModule),
      },
      {
        path: 'denuncias',
        loadChildren: () => import('./modules/denuncia/denuncia.module').then(m => m.DenunciaModule),
      },
      {
        path: 'canal',
        loadChildren: () => import('./modules/canal/canal.module').then(m => m.CanalModule),
      },
      {
        path: 'live',
        loadChildren: () => import('./modules/live/live.module').then(m => m.LiveModule),
      },
      {
        path: 'comentarios',
        loadChildren: () => import('./modules/comentario/comentario.module').then(m => m.ComentarioModule),
      },
      {
        path: 'temporadas',
        loadChildren: () => import('./modules/temporada/temporada.module').then(m => m.TemporadaModule),
      },
      {
        path: 'events',
        loadChildren: () => import('./modules/event/event.module').then(m => m.EventModule),
      }, {
        path: 'solicitud',
        loadChildren: () => import('./modules/solicitud/solicitud.module').then(m => m.SolicitudModule),
      },
      {
        path: 'solicitud-canal',
        loadChildren: () => import('./modules/solicitud-canal/solicitud-canal.module').then(m => m.SolicitudCanalModule),
      }, 
      {
        path: 'votes',
        loadChildren: () => import('./modules/vote/vote.module').then(m => m.VoteModule),
      },
      {
        path: 'faqs',
        loadChildren: () => import('./modules/faq/faq.module').then(m => m.FaqModule),
      },
      {
        path: 'logs',
        loadChildren: () => import('./modules/logs/logs.module').then(m => m.LogsModule),
      },
      {
        path: '',
        loadChildren:
          () => import('./material-component/material.module').then(m => m.MaterialComponentsModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      }
    ]
  },
  {
    path: 'terms', component: TermsComponent
  },
  { path: 'about', component: AboutComponent },
];
