import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
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
  }

  buscarGifs(term: string = '') {
    term = term.trim().toLocaleLowerCase();
    if (!this._historial.includes(term)) {
      this._historial.unshift(term);
      this._historial = this._historial.splice(0, 10);
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }
    this.http.get<SearchGifsResponse>(`https://api.giphy.com/v1/gifs/search?api_key=${this.apiKey}&q=${term}&limit=10`)
      .subscribe((resp: SearchGifsResponse) => {
        console.log(resp.data);
        this.resultados = resp.data;
      });
  }
}
