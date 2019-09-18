import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  _useIsAuthenticated = false;

  get userIsAuthenticated() {
    return this._useIsAuthenticated;
  }

  constructor() { }

  login() {
    this._useIsAuthenticated = true;
  }

  logout() {
    this._useIsAuthenticated = false;
  }
}
