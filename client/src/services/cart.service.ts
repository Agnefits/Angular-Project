import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { IProduct } from '../models/iproduct';
import { IOrder } from '../models/iorder';

export type PaymentMethod = 'stripe' | 'cash_on_delivery';

export interface CartProduct {
  productId: IProduct;
  quantity: number;
}

export interface CartData {
  _id?: string;
  products: CartProduct[];
  state: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly apiUrl = 'http://localhost:5000/api/cart';
  readonly count = signal(0);

  constructor(private http: HttpClient, private auth: AuthService) {}

  getCart(): Observable<{ status: string; data: CartData }> {
    return this.http.get<{ status: string; data: CartData }>(this.apiUrl, {
      headers: this.auth.getAuthHeaders(),
    }).pipe(tap((response) => this.setCountFromCart(response.data)));
  }

  getCount() {
    return this.http.get<{ status: string; data: { count: number } }>(`${this.apiUrl}/count`, {
      headers: this.auth.getAuthHeaders(),
    }).pipe(tap((response) => this.count.set(response.data.count)));
  }

  addToCart(productId: string, quantity = 1): Observable<{ status: string; data: CartData }> {
    return this.http.post<{ status: string; data: CartData }>(`${this.apiUrl}/add`, { productId, quantity }, {
      headers: this.auth.getAuthHeaders(),
    }).pipe(tap((response) => this.setCountFromCart(response.data)));
  }

  removeFromCart(productId: string): Observable<{ status: string; data: CartData }> {
    return this.http.delete<{ status: string; data: CartData }>(`${this.apiUrl}/${productId}`, {
      headers: this.auth.getAuthHeaders(),
    }).pipe(tap((response) => this.setCountFromCart(response.data)));
  }

  checkout(paymentMethod: PaymentMethod, paymentMethodId = ''): Observable<{ status: string; message: string; paymentMethod: PaymentMethod; data: IOrder }> {
    return this.http.post<{ status: string; message: string; paymentMethod: PaymentMethod; data: IOrder }>(`${this.apiUrl}/checkout`, { paymentMethod, paymentMethodId }, {
      headers: this.auth.getAuthHeaders(),
    }).pipe(tap(() => this.count.set(0)));
  }

  clear() {
    this.count.set(0);
  }

  private setCountFromCart(cart: CartData | null) {
    this.count.set(cart?.products?.reduce((total, item) => total + item.quantity, 0) || 0);
  }
}
