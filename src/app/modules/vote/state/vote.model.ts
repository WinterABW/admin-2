import {User} from "../../../models/user";
import {Publicacion} from "../../../models/publicacion";

export interface Vote {
  id: number;
  fecha: string;
  usuario: User;
  publicacion: Publicacion;
  valor: boolean;
}

export function createVote(params: Partial<Vote>) {
  return {

  } as Vote;
}
