import { Injectable } from '@angular/core';
import { CanActivateChild, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}

  canActivateChild(): boolean | UrlTree {
    if (!this.auth.isLoggedIn()) {
      return this.router.createUrlTree(['/signup'], {
        queryParams: { msg: 'You must log in first' },
      });
    }

    return true;
  }
}
