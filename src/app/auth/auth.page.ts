import { Component, OnInit } from '@angular/core';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';
import {NgForm} from '@angular/forms';

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
              private loadingController: LoadingController) { }

  ngOnInit() {
  }

  onLogin() {
    this.isLoading = true;
    this.loadingController.create({
      keyboardClose: true,
      message: 'Logging in......'
    }).then(loadingEl => {
      loadingEl.present();
      this.authService.login();

      setTimeout(() => {
        this.isLoading = false;
        loadingEl.dismiss();
        this.router.navigateByUrl('/places/tabs/discover');
      }, 1500);
    });
  }

    onSubmit(f: NgForm) {
      if (!f.valid) {
        return;
      }
      const email = f.value.email;
      const password = f.value.password;

      if (this.isLogin) {

      } else {

      }
    }

  onSwitchAuth() {
    this.isLogin = !this.isLogin;
  }
}
