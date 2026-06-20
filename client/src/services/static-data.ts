import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { IProduct } from '../models/iproduct';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class StaticData {
  private readonly apiUrl = 'http://localhost:5000/api/products';
  private readonly products = signal<IProduct[]>([]);

  constructor(private http: HttpClient, private auth: AuthService) {}

  loadProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.apiUrl).pipe(
      tap((products) => this.products.set(products))
    );
  }

  loadMyProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.apiUrl}/mine`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getAllPro(): IProduct[] {
    return this.products();
  }

  setProducts(products: IProduct[]) {
    this.products.set(products);
  }

  getFillteredPro(SelectedCategory: string, accending: boolean, decending: boolean): IProduct[] {
    const filtered = this.products().filter((item) => SelectedCategory === 'All' || item.category === SelectedCategory);

    if (accending) {
      filtered.sort((a, b) => a.price - b.price);
    } else if (decending) {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }

  getProById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}/${id}`);
  }

  deleteProById(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.auth.getAuthHeaders(),
    }).pipe(
      tap(() => {
        this.products.update((items) => items.filter((item) => item.id !== id));
      })
    );
  }

  createPro(pro: Partial<IProduct>): Observable<IProduct> {
    return this.http.post<IProduct>(this.apiUrl, this.normalizeProduct(pro), {
      headers: this.auth.getAuthHeaders(),
    }).pipe(
      tap((created) => {
        this.products.update((items) => [...items, created].sort((a, b) => (a.id ?? 0) - (b.id ?? 0)));
      })
    );
  }

  editPro(id: number, pro: Partial<IProduct>): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.apiUrl}/${id}`, this.normalizeProduct(pro), {
      headers: this.auth.getAuthHeaders(),
    }).pipe(
      tap((updated) => {
        this.products.update((items) => items.map((item) => (item.id === updated.id ? updated : item)));
      })
    );
  }

  private normalizeProduct(pro: Partial<IProduct>) {
    return {
      id: pro.id ? Number(pro.id) : undefined,
      title: (pro.title || '').toString().trim(),
      description: (pro.description || '').toString().trim(),
      category: (pro.category || '').toString().trim(),
      price: Number(pro.price ?? 0),
      thumbnail: (pro.thumbnail || '').toString().trim(),
      stock: Number(pro.stock ?? 0),
    };
  }
}
