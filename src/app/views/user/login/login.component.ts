import { Component, ViewChild, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/models';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm: NgForm;
  emailModel = 'demo@demo.com';
  passwordModel = '123456';

  buttonDisabled = false;
  buttonState = '';

  constructor(
    public authService: AuthService,
    private notifications: NotificationsService,
    private router: Router,
    public firebaseService: FirebaseService,
    public ngZone: NgZone
  ) {}

  onSubmit(): void {
    if (!this.loginForm.valid || this.buttonDisabled) {
      return;
    }
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.authService
      .emailSignIn(this.loginForm.value)
      .then(async (user) => {
        await this.authService.setLocalStorage(user);
        this.router.navigate([environment.adminRoot]);
      })
      .catch((error) => {
        this.buttonDisabled = false;
        this.buttonState = '';
        this.notifications.create('Error', error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false,
        });
      });
  }

  users: User[];
  googleAuth() {
    this.authService.googleAuth().then(async (user: firebase.User) => {
      this.detectOverlapUser(user);
      await this.authService.setLocalStorage(user);
      this.ngZone.run(() => {
        this.router.navigate([environment.adminRoot]);
      });
    });
  }

  facebookAuth() {
    this.authService.facebookAuth().then(async (user: firebase.User) => {
      this.detectOverlapUser(user);
      await this.authService.setLocalStorage(user);
      this.ngZone.run(() => {
        this.router.navigate([environment.adminRoot]);
      });
    });
  }

  detectOverlapUser(user) {
    this.firebaseService.readUser(user.uid).subscribe((data) => {
      this.users = data.map((e) => {
        return {
          ...e.payload.doc.data(),
        } as User;
      });

      if (this.users.length == 0) {
        this.firebaseService.createUser(user);
      }
    });
  }
}
