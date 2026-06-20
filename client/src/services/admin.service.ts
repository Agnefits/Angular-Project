import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { IProduct } from '../models/iproduct';

export interface IUser {
  _id: string;
  username: string;
  role: 'user' | 'admin';
  address?: { city?: string; street?: string };
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly usersUrl = 'http://localhost:5000/api/users';
  private readonly productsUrl = 'http://localhost:5000/api/products';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getUsers() {
    return this.http.get<{ status: string; data: IUser[] }>(this.usersUrl, { headers: this.auth.getAuthHeaders() });
  }

  deleteUser(id: string) {
    return this.http.delete<{ message: string }>(`${this.usersUrl}/${id}`, { headers: this.auth.getAuthHeaders() });
  }

  getProducts() {
    return this.http.get<IProduct[]>(this.productsUrl);
  }

  deleteProduct(id: number) {
    return this.http.delete<{ message: string }>(`${this.productsUrl}/${id}`, { headers: this.auth.getAuthHeaders() });
  }
}
