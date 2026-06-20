import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (!this.auth.isLoggedIn()) {
      return this.router.createUrlTree(['/login'], {
        queryParams: { msg: 'You must log in first' },
      });
    }

    if (!this.auth.isAdmin()) {
      return this.router.createUrlTree(['/app/products'], {
        queryParams: { msg: 'Admin access required' },
      });
    }

    return true;
  }
}
