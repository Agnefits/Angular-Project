import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IProduct } from '../../models/iproduct';
import { IOrder, OrderStatus } from '../../models/iorder';
import { StaticData } from '../../services/static-data';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  products: IProduct[] = [];
  myOrders: IOrder[] = [];
  receivedOrders: IOrder[] = [];
  statuses: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  loading = false;
  error = '';

  constructor(private staticData: StaticData, private orderService: OrderService) {}

  ngOnInit() { this.loadProducts(); this.loadOrders(); }

  get totalProductValue() { return this.products.reduce((total, product) => total + product.price * product.stock, 0); }

  loadProducts() {
    this.loading = true;
    this.error = '';
    this.staticData.loadMyProducts().subscribe({
      next: (products) => { this.products = products; this.loading = false; },
      error: (err) => { this.products = []; this.loading = false; this.error = err?.error?.message || 'Failed to load dashboard products'; },
    });
  }

  loadOrders() {
    this.orderService.getMyOrders().subscribe({ next: (r) => this.myOrders = r.data, error: () => {} });
    this.orderService.getReceivedOrders().subscribe({ next: (r) => this.receivedOrders = r.data, error: () => {} });
  }

  deleteProduct(id?: number) {
    if (!id) return;
    this.staticData.deleteProById(id).subscribe({ next: () => this.products = this.products.filter((product) => product.id !== id), error: (err) => this.error = err?.error?.message || 'Failed to delete product' });
  }

  badge(status: string) {
    return { Pending: 'text-bg-secondary', Confirmed: 'text-bg-info', Processing: 'text-bg-primary', Shipped: 'text-bg-warning', Delivered: 'text-bg-success', Cancelled: 'text-bg-danger' }[status] || 'text-bg-secondary';
  }

  updateOrder(order: IOrder, status: OrderStatus) {
    this.orderService.updateStatus(order._id, status).subscribe({ next: (r) => order.status = r.data.status, error: (err) => this.error = err?.error?.message || 'Failed to update order' });
  }
}
