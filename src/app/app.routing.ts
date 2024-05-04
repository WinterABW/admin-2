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
      },
      {
        path: 'security',
        loadChildren: () => import('./modules/security/security.module').then(m => m.SecurityModule),
      },
      {
        path: 'tipologias',
        loadChildren: () => import('./modules/tipologia/tipologia.module').then(m => m.TipologiaModule),
      },
      {
        path: 'genero',
        loadChildren: () => import('./modules/genero/genero.module').then(m => m.GeneroModule),
      },
      {
        path: 'faqs',
        loadChildren: () => import('./modules/faq/faq.module').then(m => m.FaqModule),
      },
      {
        path: 'visitas',
        loadChildren: () => import('./modules/visita/visita.module').then(m => m.VisitaModule),
      },
      {
        path: 'seller',
        loadChildren: () => import('./modules/seller/seller.module').then(m => m.SellerModule),
      },
      {
        path: 'logs',
        loadChildren: () => import('./modules/logs/logs.module').then(m => m.LogsModule),
      },
      {
        path: 'ofertas',
        loadChildren: () => import('./modules/offer/offer.module').then(m => m.OfferModule),
      },
      {
        path: 'portada',
        loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
      },{
        path: 'usuarios',
        loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule),
      },
      {
        path: 'plan',
        loadChildren: () => import('./modules/plan/plan.module').then(m => m.PlanModule),
      },
      {
        path: 'user-playlist',
        loadChildren: () => import('./modules/user-playlist/user-playlist.module').then(m => m.UserPlaylistModule),
      },
      {
        path: 'dash',
        loadChildren: () => import('./modules/dash/dash.module').then(m => m.DashModule),
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
