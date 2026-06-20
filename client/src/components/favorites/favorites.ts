import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnInit {
  loading = false;
  error = '';

  constructor(public favorites: FavoriteService) {}

  ngOnInit() {
    this.loading = true;
    this.favorites.loadFavorites().subscribe({
      next: () => this.loading = false,
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Failed to load favorites';
      },
    });
  }

  remove(productId?: string) {
    if (!productId) return;
    this.favorites.toggle(productId).subscribe({ error: (err) => this.error = err?.error?.message || 'Failed to update favorites' });
  }
}
