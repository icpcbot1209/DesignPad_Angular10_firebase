import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import { AuthService } from './auth.service';
import { JAN } from '@angular/material/core';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router, private ngZone: NgZone) {}

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('user')) {
      if (route.data.roles.includes(JSON.parse(localStorage.getItem('role')))) {
        return true;
      } else {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    } else {
      this.router.navigate(['/user/login']);
      return false;
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // console.log(JSON.parse(this.authService.user));
    if (JSON.parse(localStorage.getItem('user'))) {
      // if (JSON.parse(this.authService.user)) {
      console.log('1');
      if (route.url.toString() == '' || route.url.toString() == 'user') {
        this.ngZone.run(() => {
          this.router.navigate(['/app']);
        });
        return false;
      }

      if (route.data.roles.includes(JSON.parse(localStorage.getItem('user')).role)) {
        // if (route.data.roles.includes(JSON.parse(this.authService.user).role)) {
        return true;
      } else {
        this.ngZone.run(() => {
          this.router.navigate(['/unauthorized']);
        });
        return false;
      }
    } else {
      console.log('2');
      if (route.url.toString() == 'app') {
        console.log('app');
        this.ngZone.run(() => {
          this.router.navigate(['/user']);
        });
        return false;
      }
      if (route.url.toString() == '') {
        return true;
      }

      return true;
      // this.ngZone.run(() => {
      //   this.router.navigate(['/']);
      // });
      // return false;
    }
  }
}
