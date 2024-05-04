import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, map, pluck } from 'rxjs/operators';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { UtilesService } from './utiles.service';
import { environment } from 'src/environments/environment';

const baseUrl=environment.baseUrl
const baseUrlv2=environment.baseUrlv2

const URL = `${baseUrl}/publicacion`;
const URLv2 = `${baseUrlv2}/publicacion`;
const URL_NOMAD = `http://172.28.106.2:4646/v1/job`;

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  constructor(
    private httpClient: HttpClient,
    private utils: UtilesService
  ) {
  }

  getPlaylist(id): Observable<any> {
    return this.httpClient.get(`${baseUrlv2}/lista_reproduccion_canal/`, {
      params: new HttpParams()
        .set('id', id)
    }).pipe(
      pluck('results')
    );
  }

  getAll(params?) {
    const queryParams = this.utils.getQueryParams(params);
    return this.httpClient.get(`${URLv2}/`, {
      params: queryParams
    });
  }

  validate(nombre: string, id_publicacion?: number) {
    const fd = new FormData();
    fd.append('nombre', nombre);
    if (id_publicacion) {
      fd.append('publicacion_id', id_publicacion.toString());
    }
    return this.httpClient.post(`${URL}/validar_campos/`, fd);

  }

  validateAll(publicacion, modelo) {
    const fd = new FormData();
    for (const field in publicacion) {
      if (publicacion[field] && field === 'release_date') {
        fd.append('release_date', format(publicacion.release_date, 'yyyy-MM-dd\'T\'HH:mm', { locale: es }));
      } else if (publicacion[field] && field === 'sale_start_date') {
        fd.append('sale_start_date', format(publicacion.sale_start_date, 'yyyy-MM-dd\'T\'HH:mm', { locale: es }));
      } else {
        fd.append(field, Array.isArray(publicacion[field]) ? publicacion[field].map(i => i.id ? i.id : i) : publicacion[field]);

      }
    }
    return this.httpClient.post(`${URL}/validar_campos/`, fd);

  }

  validateUpdate(publicacion) {
    const fd = new FormData();
    for (const field in publicacion) {
      if (publicacion[field] && field === 'release_date') {
        fd.append('release_date', format(publicacion.release_date, 'yyyy-MM-dd\'T\'HH:mm'));
      } else if (publicacion[field] && field === 'sale_start_date') {
        fd.append('sale_start_date', format(publicacion.sale_start_date, 'yyyy-MM-dd\'T\'HH:mm'));
      } else {
        fd.append(field, Array.isArray(publicacion[field]) ? publicacion[field].map(i => i.id ? i.id : i) : publicacion[field]);

      }
    }
    return this.httpClient.post(`${URL}/validar_campos/?id=${publicacion.id}`, fd);

  }

  generarClave() {
    return this.httpClient.get(`${URLv2}/generar_clave/`).pipe(
      map((res: any) => res.clave)
    );
  }

  create(publicacion, modelo) {
    const body = new FormData();
    body.append('nombre', publicacion.nombre);
    body.append('canal', publicacion.canal);
    body.append('descripcion', publicacion.descripcion);
    body.append('mostrar_comentarios', publicacion.mostrar_comentarios);
    publicacion.mostrar_chat && body.append('mostrar_chat', publicacion.mostrar_chat);
    publicacion.url_manifiesto && body.append('url_manifiesto', publicacion.url_manifiesto);
    body.append('url_imagen', publicacion.url_imagen);
    if (publicacion.tipo === 'live') {
      body.append('palabraClave', publicacion.palabraClave.toString());
      body.append('clave_emision', publicacion.clave_emision);
    } else {
      body.append('palabraClave', publicacion.palabras_claves.toString());
    }
    if (publicacion.tipo !== 'publicacion_en_vivo') {
      body.append('tipologia', publicacion.tipologia.toString());
    }
    publicacion.precios.length && body.append('precios', JSON.stringify(publicacion.precios));
    body.append('tipo', publicacion.tipo);
    body.append('publicado', publicacion.publicado);
    body.append('internacional', publicacion.internacional);
    if (publicacion.url_subtitulo) {
      body.append('url_subtitulo', publicacion.url_subtitulo);
    }

    switch (modelo) {
      case 'eventotipologia': {
        body.append('evento', publicacion.evento);
        break;
      }
      case 'capitulo': {
        body.append('numero', publicacion.numero);
        body.append('temporada', publicacion.temporada.toString());
        break;
      }
      case 'reportaje': {// OK
        body.append('autor', publicacion.autor);
        break;
      }
      case 'documental': {// OK
        body.append('productora', publicacion.productora.map(i => i.id));
        body.append('pais', publicacion.pais);
        break;

      }
      case 'audio': { // OK
        publicacion.autor.length && body.append('autor', publicacion.autor.map(i => i.id));
        /*  publicacion.interprete.length && body.append('interprete', publicacion.interprete.map(i => i.id));
          publicacion.productor.length && body.append('productor', publicacion.productor.map(i => i.id));
          body.append('ano', publicacion.ano.toString());
          body.append('pais', publicacion.pais);
          body.append('genero', publicacion.genero);
          body.append('disco', publicacion.disco);*/
        break;
      }
      case 'cancion': {
        body.append('productor_ejecutivo', publicacion.productor_ejecutivo.map(i => i.id));
        body.append('publisher', publicacion.publisher.map(i => i.id));
        body.append('performer', publicacion.performer.map(i => i.id));
        body.append('invitado', publicacion.invitado.map(i => i.id));
        body.append('autor', publicacion.autor.map(i => i.id));

        body.append('isrc', publicacion.isrc);
        body.append('masterights', publicacion.masterights);
        body.append('release_date', format(publicacion.release_date, 'yyyy-MM-dd\'T\'HH:mm', { locale: es }));
        body.append('sale_start_date', format(publicacion.sale_start_date, 'yyyy-MM-dd\'T\'HH:mm', { locale: es }));
        body.append('sello', publicacion.sello);
        body.append('pais_fonograma', publicacion.pais_fonograma);
        body.append('codigo_producto', publicacion.codigo_producto);
        body.append('numero_track', publicacion.numero_track);
        body.append('titulo_track', publicacion.titulo_track);


        break;
      }
      case 'videoclip': { // OK
        body.append('interprete', publicacion.interprete.map(i => i.id));
        publicacion.productor && body.append('productor', publicacion.productor.map(i => i.id));
        body.append('ano', publicacion.ano.toString());
        body.append('director', publicacion.director.map(i => i.id));
        body.append('director_fotografico', publicacion.director_fotografico.map(i => i.id));
        publicacion.director_arte && body.append('director_arte', publicacion.director_arte.map(i => i.id));
        publicacion.director_artistico && body.append('director_artistico', publicacion.director_artistico.map(i => i.id));
        body.append('guionista', publicacion.guionista.map(i => i.id));
        body.append('genero', publicacion.genero);
        body.append('sello', publicacion.sello);
        body.append('release_date', format(publicacion.release_date, 'yyyy-MM-dd\'T\'HH:mm', { locale: es }));
        body.append('sale_start_date', format(publicacion.sale_start_date, 'yyyy-MM-dd\'T\'HH:mm', { locale: es }));
        body.append('genero', publicacion.genero);
        break;
      }
      case 'curso': {
        body.append('autor', publicacion.autor.map(i => i.id));
        body.append('temporada', publicacion.temporada.toString());
        break;

      }
      case 'pelicula': {
        body.append('pais', publicacion.pais);
        body.append('director', publicacion.director.map(i => i.id));
        body.append('ano', publicacion.ano.toString());
        body.append('productora', publicacion.productora.map(i => i.id));
        body.append('genero', publicacion.genero);
        body.append('premio', publicacion.premio.map(i => i.id));
        body.append('reparto', publicacion.reparto.map(i => i.id));
        body.append('fotografia', publicacion.fotografia.map(i => i.id));
        body.append('musica', publicacion.musica.map(i => i.id));
        body.append('guion', publicacion.guion.map(i => i.id));
        body.append('imagen_secundaria', publicacion.imagen_secundaria);

        break;
      }

    }
    return this.httpClient.post(`${baseUrl}/publicacion/`, body);
  }

  getUrl(url_minio_pub?, videoNuevoFlag = true) {
    let extra = '';
    if (url_minio_pub) {
      extra = `?url_minio_pub=${url_minio_pub}&&video_nuevo=${videoNuevoFlag}`;
    }
    return this.httpClient.get(`${baseUrlv2}/publicacion/devolver_url_minio/${extra}`);
  }

  uploadFile(url, formData: FormData) {

    return this.httpClient.post(url, formData, {
      headers: new HttpHeaders().append('ngsw-bypass', 'true'),
      reportProgress: true,
      observe: 'events'
    }).pipe(
      // delay(10000)
    );

  }

  deletePublication(id: number) {
    return this.httpClient.delete(`${URL}/${id}/`);
  }

  setStatus(id: any, publicado: any, tipo, tipologia?) {
    const body = new FormData();
    body.append('publicado', publicado);
    body.append('tipo', tipo);
    if (tipologia) {
      body.append('tipologia', tipologia);
    }
    return this.httpClient.patch(`${baseUrl}/publicacion/${id}/`, body);
  }


  loadPublication(slug_url: string): Observable<any> {
    return this.httpClient.get<any>(`${URLv2}/`, {
      params: new HttpParams().set('slug_url_raw', slug_url)
    }).pipe(
      map((response: any) => response.results ? response.results[0] : null)
    );
  }

  update(id: number, publicacion: any) {

    const fd = new FormData();
    for (const field in publicacion) {
      if (publicacion[field] && field === 'release_date') {
        fd.append('release_date', format(publicacion.release_date, 'yyyy-MM-dd\'T\'HH:mm', { locale: es }));
      } else if (publicacion[field] && field === 'sale_start_date') {
        fd.append('sale_start_date', format(publicacion.sale_start_date, 'yyyy-MM-dd\'T\'HH:mm', { locale: es }));
      } else {
        fd.append(field, Array.isArray(publicacion[field]) ? publicacion[field].map(i => i.id ? i.id : i) : publicacion[field]);

      }
    }
    publicacion.precios && fd.set('precios', JSON.stringify(publicacion.precios));

    return this.httpClient.patch(`${URL}/${id}/`, fd);
  }

  getByTipoContenido(tipo: string): Observable<any[]> {
    return this.httpClient.get<any>(`${URLv2}/?tipo=${tipo}`).pipe(pluck('results'));
  }

  generarDescargaLocal(video_id: string) {
    const body = new FormData();
    body.append('action', 'generate_download');
    body.append('minio_id', video_id);
    return this.httpClient.post(`${URLv2}/proxy_nomad/`, body);
  }

  deleteDescarga(video_id: string) {
    const body = new FormData();
    body.append('action', 'delete_download');
    body.append('minio_id', video_id);
    return this.httpClient.post(`${URLv2}/proxy_nomad/`, body);
  }

  convertirVideo(output: string, descargable = true) {
    const body = new FormData();
    body.append('action', 'convert');
    body.append('minio_id', output);
    body.append('descargable', JSON.stringify(descargable));
    return this.httpClient.post(`${URLv2}/proxy_nomad/`, body);
  }

  stopConvertion(output: string) {
    const body = new FormData();
    body.append('action', 'stop_convert');
    body.append('data', JSON.stringify({
      Meta: {
        output
      }
    }));
    return this.httpClient.post(`${URLv2}/proxy_nomad/`, body);
  }
  stopLive(output: string) {
    const body = new FormData();
    body.append('action', 'end_live');
    body.append('minio_id', output);

    return this.httpClient.post(`${URLv2}/proxy_nomad/`, body);
  }
}
