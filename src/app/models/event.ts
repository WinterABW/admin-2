import { User } from "./user";


export interface Evento {
  id: number;
  nombre: string;
  usuarios: User[];
}
