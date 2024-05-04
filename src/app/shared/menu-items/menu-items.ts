import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

const MENUITEMS = [
  { state: 'dash', name: 'Dash', type: 'link', icon: 'av_timer' },
  { state: 'security', name: 'Seguridad', type: 'link', icon: 'security' },
  { state: 'genero', name: 'Género', type: 'link', icon: 'voicemail' },
  { state: 'faqs', name: 'FAQ', type: 'link', icon: 'shield-question-outline-rounded' },
  { state: 'ofertas', name: 'Ofertas', type: 'link', icon: 'shield-question-outline-rounded' },
  { state: 'plan', name: 'Planes', type: 'link', icon: 'shield-question-outline-rounded' },
  { state: 'user-playlist', name: 'Listas de usuarios', type: 'link', icon: 'shield-question-outline-rounded' },
  { state: 'portada', name: 'Portada', type: 'link', icon: 'shield-question-outline-rounded' },
  { state: 'usuarios', name: 'Usuarios', type: 'link', icon: 'shield-question-outline-rounded' },
  { state: 'tipologias', name: 'Tipologías', type: 'link', icon: 'shield-question-outline-rounded' },
  { state: 'seller', name: 'Vendedores', type: 'link', icon: 'shield-question-outline-rounded' },
  { state: 'logs', name: 'Logs', type: 'link', icon: 'shield-question-outline-rounded' },
  { state: 'visitas', name: 'Visitas', type: 'link', icon: 'shield-question-outline-rounded' },
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
    icon: 'vertical_align_center'
  },
  { state: 'chips', type: 'link', name: 'Chips', icon: 'vignette' },
  { state: 'toolbar', type: 'link', name: 'Toolbar', icon: 'voicemail' },
  {
    state: 'progress-snipper',
    type: 'link',
    name: 'Progress snipper',
    icon: 'border_horizontal'
  },
  {
    state: 'progress',
    type: 'link',
    name: 'Progress Bar',
    icon: 'blur_circular'
  },
  {
    state: 'dialog',
    type: 'link',
    name: 'Dialog',
    icon: 'assignment_turned_in'
  },
  { state: 'tooltip', type: 'link', name: 'Tooltip', icon: 'assistant' },
  { state: 'snackbar', type: 'link', name: 'Snackbar', icon: 'adb' },
  { state: 'slider', type: 'link', name: 'Slider', icon: 'developer_mode' },
  {
    state: 'slide-toggle',
    type: 'link',
    name: 'Slide Toggle',
    icon: 'all_inclusive'
  }
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
