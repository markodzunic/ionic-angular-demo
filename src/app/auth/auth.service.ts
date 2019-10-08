import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, from} from 'rxjs';
import {User} from './user.model';
import {map, tap} from 'rxjs/operators';
import {Plugins} from '@capacitor/core';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  _user = new BehaviorSubject<User>(null);
  private logoutTimer: any;

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return !!user.token;
      } else {
        return false;
      }
    }));
  }

  get token() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user.token;
      } else {
        return null;
      }
    }));
  }

  get userId() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user.id;
      } else {
        return null;
      }
    }));
  }

  constructor(private http: HttpClient) { }

  autoLogin() {
    return from(Plugins.Storage.get({key: 'authData'})).pipe(map(storedData => {
      if (!storedData || !storedData.value) {
        return null;
      }
      const parsedData = JSON.parse(storedData.value) as {userId: string, token: string, tokenExpirationDate: string, email: string};
      const expiration = new Date(parsedData.tokenExpirationDate);
      if (expiration <= new Date()) {
        return null;
      }
      return new User(parsedData.userId, parsedData.email, parsedData.token, expiration );
    }), tap(user => {
      if (user) {
        this._user.next(user);
      }
      this.autoLogout(user.tokenDuration);
    }), map(user => {
      return !!user;
    }));
  }

  private autoLogout(duration: number) {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`, {
      email,
      password,
      returnSecureToken: true
    }).pipe(tap(this.setUserData.bind(this)));
  }

  private setUserData(userData: AuthResponseData) {
    const expirationDate = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
    const user = new User(userData.localId, userData.email, userData.idToken, expirationDate);
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(userData.localId, userData.idToken, userData.expiresIn, userData.email);
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`, {
      email,
      password,
      returnSecureToken: true
    }).pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
    this._user.next(null);
    Plugins.Storage.remove({key: 'authData'});
  }

  private storeAuthData(userId: string, token: string, tokenExpirationDate: string, email: string) {
    const data = JSON.stringify({userId, token, tokenExpirationDate, email});
    Plugins.Storage.set({key: 'authData', value: data});
  }

  ngOnDestroy(): void {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
  }
}
