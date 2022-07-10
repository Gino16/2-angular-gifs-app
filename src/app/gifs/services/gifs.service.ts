import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private url = 'https://api.giphy.com/v1/gifs';
  private apiKey = 'Z5tvp7Y93LOpOIVifSdpOHW8jBVSvImi';
  private _historial: string[] = [];

  public resultados: Gif[] = [];
  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    if (localStorage.getItem('historial')) {
      this._historial = JSON.parse(localStorage.getItem('historial')!);
    }
    if(localStorage.getItem('busqueda')) {
      this.resultados = JSON.parse(localStorage.getItem('busqueda')!);
    }
  }

  buscarGifs(term: string = '') {
    term = term.trim().toLocaleLowerCase();
    if (!this._historial.includes(term)) {
      this._historial.unshift(term);
      this._historial = this._historial.splice(0, 10);
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('q', term)
    .set('limit', '10');

    this.http.get<SearchGifsResponse>(`${this.url}/search`, {params})
      .subscribe((resp: SearchGifsResponse) => {
        console.log(resp.data);
        this.resultados = resp.data;
        localStorage.setItem('busqueda', JSON.stringify(this.resultados));
      });
  }
}
