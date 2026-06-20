import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { FavoriteService } from '../../services/favorite.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar implements OnInit {
  constructor(public auth: AuthService, public favorites: FavoriteService, public cart: CartService) {}

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.favorites.loadFavorites().subscribe({ error: () => this.favorites.clear() });
      this.cart.getCount().subscribe({ error: () => this.cart.clear() });
    }
  }

  logout() {
    this.favorites.clear();
    this.cart.clear();
    this.auth.logout();
  }
}
