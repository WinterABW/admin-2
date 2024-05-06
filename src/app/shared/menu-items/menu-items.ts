import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

const MENUITEMS = [
  { state: 'dash', name: 'Dash', type: 'link', icon: 'dashboard' },
  {
    state: 'sales',
    name: 'Ventas',
    type: 'link',
    icon: 'real_estate_agent',
  },
  {
    state: 'incomes',
    name: 'Ingresos',
    type: 'link',
    icon: 'payments',
  },
  {
    state: 'publicaciones',
    name: 'Publicaciones',
    type: 'link',
    icon: 'auto_awesome_motion',
  },
  {
    state: 'live',
    name: 'Directas',
    type: 'link',
    icon: 'cast',
  },
  {
    state: 'canal',
    name: 'Canales',
    type: 'link',
    icon: 'subscriptions',
  },
  {
    state: 'playlist',
    name: 'Listas',
    type: 'link',
    icon: 'list',
  },

  {
    state: 'comentarios',
    name: 'Comentarios',
    type: 'link',
    icon: 'forum',
  },
  {
    state: 'series',
    name: 'Series',
    type: 'link',
    icon: 'video_library',
  },
  {
    state: 'temporadas',
    name: 'Temporadas',
    type: 'link',
    icon: 'library_add_check',
  },
  {
    state: 'events',
    name: 'Eventos',
    type: 'link',
    icon: 'calendar_month',
  },
  {
    state: 'denuncias',
    name: 'Denuncias',
    type: 'link',
    icon: 'warning',
  },
  {
    state: 'solicitud',
    name: 'Solicitud',
    type: 'link',
    icon: 'person_add',
  },
  {
    state: 'solicitud-canal',
    name: 'Solicitud de Canal',
    type: 'link',
    icon: 'playlist_add',
  },
  {
    state: 'votes',
    name: 'Votos',
    type: 'link',
    icon: 'thumbs_up_down',
  },
  {
    state: 'logs',
    name: 'Logs',
    type: 'link',
    icon: 'history',
  },
  {
    state: 'faqs',
    name: 'FAQ',
    type: 'link',
    icon: 'quiz',
  },

  { state: 'dashboard', name: 'Dashboard', type: 'link', icon: 'av_timer' },
  { state: 'button', type: 'link', name: 'Buttons', icon: 'crop_7_5' },
  { state: 'grid', type: 'link', name: 'Grid List', icon: 'view_comfy' },
  { state: 'lists', type: 'link', name: 'Lists', icon: 'view_list' },
  { state: 'menu', type: 'link', name: 'Menu', icon: 'view_headline' },
  { state: 'tabs', type: 'link', name: 'Tabs', icon: 'tab' },
  { state: 'stepper', type: 'link', name: 'Stepper', icon: 'web' },
  {
    state: 'expansion',
    type: 'link',
    name: 'Expansion Panel',
    icon: 'vertical_align_center',
  },
  { state: 'chips', type: 'link', name: 'Chips', icon: 'vignette' },
  { state: 'toolbar', type: 'link', name: 'Toolbar', icon: 'voicemail' },
  {
    state: 'progress-snipper',
    type: 'link',
    name: 'Progress snipper',
    icon: 'border_horizontal',
  },
  {
    state: 'progress',
    type: 'link',
    name: 'Progress Bar',
    icon: 'blur_circular',
  },
  {
    state: 'dialog',
    type: 'link',
    name: 'Dialog',
    icon: 'assignment_turned_in',
  },
  { state: 'tooltip', type: 'link', name: 'Tooltip', icon: 'assistant' },
  { state: 'snackbar', type: 'link', name: 'Snackbar', icon: 'adb' },
  { state: 'slider', type: 'link', name: 'Slider', icon: 'developer_mode' },
  {
    state: 'slide-toggle',
    type: 'link',
    name: 'Slide Toggle',
    icon: 'all_inclusive',
  },
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
