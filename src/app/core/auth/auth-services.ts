import { inject, Injectable } from '@angular/core';
import { DefaultResponseType } from '../../../types/default.response.type';
import { Observable, Subject, throwError } from 'rxjs';
import { LoginResponseType } from '../../../types/login.response.type';
import { Environments } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthServices {
  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public idUserKey: string = 'idUser';
  private userNameKey = 'userName';
  private http = inject(HttpClient);
  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged: boolean = false;

  constructor() {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }
  login(
    email: string,
    password: string,
    rememberMe: boolean,
  ): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(Environments.api + 'login', {
      email,
      password,
      rememberMe,
    });
  }

  signup(
    name: string,
    email: string,
    password: string,
  ): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(Environments.api + 'signup', {
      name,
      email,
      password,
    });
  }
  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(Environments.api + 'logout', {
        refreshToken: tokens.refreshToken,
      });
    }
    throw throwError(() => 'Can not find token');
  }
  refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(Environments.api + 'refresh', {
        refreshToken: tokens.refreshToken,
      });
    }
    throw throwError(() => 'Can not use token');
  }
  public getIsLoggedIn() {
    return this.isLogged;
  }
  public setTokens(accessToken: string, refreshToken: string, userName?: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    console.log(userName);
    if (userName) {
      localStorage.setItem(this.userNameKey, userName);
    }
    this.isLogged = true;
    this.isLogged$.next(true);
  }
  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }
  public getTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    };
  }
  getUserName(): string {
    return localStorage.getItem(this.userNameKey) || 'Пользователь';
  }
  get userId(): null | string {
    return localStorage.getItem(this.idUserKey);
  }
  set userId(id: string | null) {
    if (id) {
      localStorage.setItem(this.idUserKey, id);
    } else {
      localStorage.removeItem(this.idUserKey);
    }
  }
}
