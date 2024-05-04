import { User } from "./user";
import { Publicacion } from "./publicacion";

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
