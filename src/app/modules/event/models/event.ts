import {User} from '../../../models/user';

export interface Evento {
  id: number;
  nombre: string;
  usuarios: User[];
}
