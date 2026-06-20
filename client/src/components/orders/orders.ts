import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IOrder, OrderStatus } from '../../models/iorder';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  myOrders: IOrder[] = [];
  receivedOrders: IOrder[] = [];
  statuses: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  error = '';

  constructor(private orders: OrderService) {}

  ngOnInit() { this.load(); }

  load() {
    this.orders.getMyOrders().subscribe({ next: (r) => this.myOrders = r.data, error: (e) => this.error = e?.error?.message || 'Failed to load orders' });
    this.orders.getReceivedOrders().subscribe({ next: (r) => this.receivedOrders = r.data, error: () => {} });
  }

  badge(status: string) {
    return {
      Pending: 'text-bg-secondary', Confirmed: 'text-bg-info', Processing: 'text-bg-primary',
      Shipped: 'text-bg-warning', Delivered: 'text-bg-success', Cancelled: 'text-bg-danger'
    }[status] || 'text-bg-secondary';
  }

  update(order: IOrder, status: OrderStatus) {
    this.orders.updateStatus(order._id, status).subscribe({ next: (r) => order.status = r.data.status, error: (e) => this.error = e?.error?.message || 'Failed to update status' });
  }
}
