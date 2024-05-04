import { Canal } from "./canal";


export interface Live {
  id: number;
  nombre: string;
  descripcion: string;
  canal: Canal;
  duracion: string;
  url_manifiesto: string;
  clave_emision: string;
  url_imagen: string;
  slug_url: string;
  publicado: boolean;
  internacional: boolean;
  mostrar_comentarios: boolean;
  mostrar_chat: boolean;
  fecha_creacion: string;
  fecha_publicado: string;
  palabraClave?: (string)[] | null;
  palabraClave_data?: ({ id: string, palabra: string })[] | null;
  usuario: Usuario;
  cantidad_no_me_gusta: number;
  cantidad_comentarios: number;
  cantidad_descargas: number;
  cantidad_visitas: number;
  precio: number;
  tipo: string;
  categoria: any;
}
export interface Usuario {
  username: string;
}
