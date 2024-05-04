import {Canal} from './canal';
import { Live } from './live';
import {PictaResponse} from './response.picta.model';


export interface Tipologia {
  id: string;
  nombre: string;
  modelo: string;
}

export interface Extra {
  id: number;
  tipo: string;
  nombre: string;
}

export interface Persona {
  id: number;
  nombre: string;
}

export interface Genero {
  id: number;
  nombre: string;
}

export interface Pelicula {
  ano: string;
  pais: string;
  productora: Extra[];
  premio: Extra[];
  director: Persona[];
  guion: Persona[];
  musica: Persona[];
  fotografia: Persona[];
  reparto: Persona[];
  genero: Genero[];
  imagen_secundaria: string;
}

export interface Serie {
  pelser_id: number;
  nombre: string;
  ano: string;
  pais: string;
  imagen_secundaria: string;
  productora?: Extra[];
  director?: Persona[];
  guion?: Persona[];
  musica?: Persona[];
  fotografia?: Persona[];
  reparto?: Persona[];
  cantidad_capitulos: number;
  cantidad_temporadas: number;
  canal: Canal;
}

export interface Temporada {
  id: number;
  nombre: string;
  cantidad_capitulos: number;
  canal: Canal;
  serie: Serie;
}

export interface Capitulo {
  id: number;
  numero: number;
  temporada: Temporada;
}

export interface Video {
  ano: string;
  genero: Genero[];
  interprete?: Persona[];
  productor?: Persona[];
  director?: Persona[];


}

export interface Documental {
  pais: string;
  productora: Extra[];
}

export interface Categoria {
  tipologia: Tipologia;
  capitulo?: Capitulo;
  video?: Video | any;
  videoclip?: Video | any;
  cancion?: any;
  pelicula?: Pelicula;
  documental?: Documental;
  eventotipologia?: any;
  audio?: any;
  reportaje?: any;
  curso?: any;
}

export interface Publicacion {
  palabraClave_data?: any;
  'url_imagen': string;
  'canal_url_avatar': string;
  'id': number;
  'nombre': string;
  'descripcion': string;
  'publicado': boolean;
  'internacional': boolean;
  'categoria': Categoria;
  'tipologia': Tipologia;
  'palabraClave': string[];
  'tipo': string;
  'url_manifiesto': string;
  'url_descarga': string;
  'url_subtitulo': string;
  'duracion': string;
  'cantidad_visitas': number;
  'lista_reproduccion_canal': any[];
  'cantidad_reproducciones': number;
  'cantidad_me_gusta': number;
  'cantidad_no_me_gusta': number;
  'cantidad_vistas_ahora': number;
  'cantidad_comentarios': number;
  'canal': Canal;
  'canal_id': number;
  'canal_slug_url': string;
  'premium': boolean;
  'precios': any[];
  'precio_id': number;
  'hd': boolean;
  'fecha_creacion': Date;
  'fecha_publicado': string;
  'convertido': boolean;
  'usuario': string;
  'slug_url': string;
  'cantidad_descargas': number;
  'descarga': string;
  'usuario_username': string;
  'descargable': boolean;
  'tiempo_creacion': string;
  'lista_comentarios': PictaResponse<any>;
  'active': boolean;
  'mostrar_chat': boolean;
  'mostrar_comentarios': boolean;
  'live'?: Live;
  time: number;
}
