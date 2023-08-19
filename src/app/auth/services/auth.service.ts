import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse, User } from '../interfaces/auth-interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _baseUrl: string = environment.baseUrl;
  private _user!: User;

  get user() {
    return { ...this._user };
  }

  constructor(private http: HttpClient) { }

  registerUser(name: string, email: string, password: string) {
    const url = `${this._baseUrl}/new`;
    const body = {
      name,
      email,
      password
    };
    return this.http.post<AuthResponse>(url, body)
      .pipe(
        tap(resp => {
          if (resp.ok) {
            localStorage.setItem('token', resp.token!)
          }
        }),
        map(resp => resp.ok),
        catchError(err => of(err.error.msg))
      );
  }

  login(email: string, password: string) {
    const url = `${this._baseUrl}`;
    const body = { email, password };
    return this.http.post<AuthResponse>(url, body)
      .pipe(
        tap(resp => {
          if (resp.ok) {
            localStorage.setItem('token', resp.token!)
          }
        }), //ejecuta una porción de codigo antes de que pase al map
        map(resp => resp.ok), //convierte la resp en lo que se desee
        catchError(err => of(err.error.msg)) //atrapa el error
      )
  }

  validateToken(): Observable<boolean> {
    const url = `${this._baseUrl}/renew`;
    const headers: HttpHeaders = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '');
    return this.http.get<AuthResponse>(url, { headers })
      .pipe(
        map(resp => {
          localStorage.setItem('token', resp.token!)
          this._user = {
            name: resp.name!,
            uid: resp.uid!,
            email: resp.email!
          }
          return resp.ok;
        }),
        catchError(err => of(false))
      )
  }

  logout() {
    localStorage.clear();
  }
}
