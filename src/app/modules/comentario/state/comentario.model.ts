export interface Comentario {
  id: number;
  contenido: string;
  publicado: boolean;
  eliminado: boolean;
  usuario: {
    avatar: string;
    username: string;
  };
  texto: string;
  publicacion: {
    id: number; // Assuming there's an id property for publicacion
    nombre: string;
  };
  // Add other properties if needed
}

export function createComentario(params: Partial<Comentario>) {
  return {} as Comentario;
}
