import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  _useIsAuthenticated = true;
  _userId = 'aaa';

  get userIsAuthenticated() {
    return this._useIsAuthenticated;
  }

  get userId() {
    return this._userId;
  }
  constructor() { }

  login() {
    this._useIsAuthenticated = true;
  }

  logout() {
    this._useIsAuthenticated = false;
  }
}
