import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fashion } from '../models/fashion.model';

@Injectable({
  providedIn: 'root'
})
export class FashionService {
  private API = 'http://localhost:4000/fashions';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Fashion[]> {
    return this.http.get<Fashion[]>(this.API);
  }

  getById(id: string): Observable<Fashion> {
    return this.http.get<Fashion>(`${this.API}/${id}`);
  }

  getByStyle(style: string): Observable<Fashion[]> {
    return this.http.get<Fashion[]>(`${this.API}/style/${encodeURIComponent(style)}`);
  }
}
