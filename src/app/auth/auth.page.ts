import { Component, OnInit } from '@angular/core';
import {AuthResponseData, AuthService} from './auth.service';
import {Router} from '@angular/router';
import {AlertController, LoadingController} from '@ionic/angular';
import {NgForm} from '@angular/forms';
import {compilerSetStylingMode} from '@angular/compiler/src/render3/view/styling_state';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(private authService: AuthService,
              private router: Router,
              private loadingController: LoadingController,
              private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingController.create({
      keyboardClose: true,
      message: 'Logging in......'
    }).then(loadingEl => {
      loadingEl.present();
      let authObs: Observable<AuthResponseData>;
      if (this.isLogin) {
        authObs = this.authService.login(email, password);
      } else {
        authObs = this.authService.signup(email, password);
      }
      authObs.subscribe(resData => {
        console.log(resData);
        this.isLoading = false;
        loadingEl.dismiss();
        this.router.navigateByUrl('/places/tabs/discover');
      }, errorRes => {
        loadingEl.dismiss();
        const code = errorRes.error.error.message;
        let message = 'Could not sign you up.';
        if (code === 'EMAIL_EXISTS') {
          message = 'This email is already used.';
        } else if (code === 'EMAIL_NOT_FOUND') {
          message = 'This email doesnt exist';
        } else if (code === 'INVALID_PASSWORD') {
          message = 'The password is incorrect';
        }
        this.showAlert(message);
      });
    });
  }

    onSubmit(f: NgForm) {
      if (!f.valid) {
        return;
      }
      const email = f.value.email;
      const password = f.value.password;

      this.authenticate(email, password);
      f.reset();
    }

  onSwitchAuth() {
    this.isLogin = !this.isLogin;
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Authentication failed',
      message: message,
      buttons: ['Okay']
    }).then(el => {
      el.present();
    });
  }
}
