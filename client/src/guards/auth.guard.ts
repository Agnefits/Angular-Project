import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    return this.checkLogin();
  }

  canActivateChild(): boolean | UrlTree {
    return this.checkLogin();
  }

  private checkLogin(): boolean | UrlTree {
    if (!this.auth.isLoggedIn()) {
      return this.router.createUrlTree(['/login'], {
        queryParams: { msg: 'You must log in first' },
      });
    }

    return true;
  }
}
