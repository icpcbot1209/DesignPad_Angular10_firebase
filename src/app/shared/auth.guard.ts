import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import { AuthService } from './auth.service';

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
    if (localStorage.getItem('user')) {
      if (route.data.roles.includes(JSON.parse(localStorage.getItem('role')))) {
        return true;
      } else {
        this.ngZone.run(() => {
          this.router.navigate(['/unauthorized']);
        });
        return false;
      }
    } else {
      this.ngZone.run(() => {
        this.router.navigate(['/user/login']);
      });
      return false;
    }
  }
}
