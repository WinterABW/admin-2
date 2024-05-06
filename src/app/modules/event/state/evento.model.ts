import {User} from '../../../models/user';

export interface Evento {
  id: number;
  nombre: string;
  payment_type: string;
  precio: number;
  multisesesion: number;
  usuarios: User[];
}

export function createEvento(params: Partial<Evento>) {
  return {} as Evento;
}
