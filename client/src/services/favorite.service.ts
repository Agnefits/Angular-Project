import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { AuthService } from './auth.service';
import { IProduct } from '../models/iproduct';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private readonly apiUrl = 'http://localhost:5000/api/users';
  private readonly _favorites = signal<IProduct[]>([]);
  readonly favorites = this._favorites.asReadonly();
  readonly count = signal(0);

  constructor(private http: HttpClient, private auth: AuthService) {}

  loadFavorites() {
    return this.http.get<{ status: string; data: { favorites: IProduct[]; count: number } }>(`${this.apiUrl}/my-favorites`, {
      headers: this.auth.getAuthHeaders(),
    }).pipe(tap((response) => this.setFavorites(response.data.favorites)));
  }

  toggle(productId: string) {
    return this.http.post<{ status: string; data: { favorites: IProduct[]; count: number } }>(`${this.apiUrl}/toggle-favorite`, { productId }, {
      headers: this.auth.getAuthHeaders(),
    }).pipe(tap((response) => this.setFavorites(response.data.favorites)));
  }

  isFavorite(productId?: string) {
    return !!productId && this._favorites().some((product) => product._id === productId);
  }

  clear() {
    this.setFavorites([]);
  }

  private setFavorites(favorites: IProduct[]) {
    this._favorites.set(favorites || []);
    this.count.set((favorites || []).length);
  }
}
