import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { IOrder, OrderStatus } from '../models/iorder';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly apiUrl = 'http://localhost:5000/api/orders';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getMyOrders() {
    return this.http.get<{ status: string; data: IOrder[] }>(`${this.apiUrl}/mine`, { headers: this.auth.getAuthHeaders() });
  }

  getReceivedOrders() {
    return this.http.get<{ status: string; data: IOrder[] }>(`${this.apiUrl}/received`, { headers: this.auth.getAuthHeaders() });
  }

  getAllOrders() {
    return this.http.get<{ status: string; data: IOrder[] }>(`${this.apiUrl}/all`, { headers: this.auth.getAuthHeaders() });
  }

  getOrder(id: string) {
    return this.http.get<{ status: string; data: IOrder }>(`${this.apiUrl}/${id}`, { headers: this.auth.getAuthHeaders() });
  }

  updateStatus(id: string, status: OrderStatus, note = '') {
    return this.http.patch<{ status: string; data: IOrder }>(`${this.apiUrl}/${id}/status`, { status, note }, { headers: this.auth.getAuthHeaders() });
  }
}
