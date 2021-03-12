import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm: NgForm;
  buttonDisabled = false;
  buttonState = '';

  constructor(
    public authService: AuthService,
    private notifications: NotificationsService,
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  onSubmit(): void {
    if (!this.registerForm.valid || this.buttonDisabled) {
      return;
    }
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    this.authService
      .emailSignUp(this.registerForm.value)
      .then(async (user) => {
        await this.firebaseService.createUser(user);
        await this.authService.setAuthData(user);

        this.router.navigate([environment.adminRoot]);
      })
      .catch((error) => {
        this.notifications.create('Error', error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false,
        });
        this.buttonDisabled = false;
        this.buttonState = '';
      });
  }

  async googleAuth() {
    this.authService.googleAuth().then(async (user: firebase.User) => {
      if (!(await this.firebaseService.readUser(user.uid))) {
        await this.firebaseService.createUser(user);
        await this.authService.setAuthData(user);
      }

      this.router.navigate([environment.adminRoot]);
    });
  }

  async facebookAuth() {
    this.authService.facebookAuth().then(async (user: firebase.User) => {
      if (!(await this.firebaseService.readUser(user.uid))) {
        await this.firebaseService.createUser(user);
        await this.authService.setAuthData(user);
      }

      this.router.navigate([environment.adminRoot]);
    });
  }
}
