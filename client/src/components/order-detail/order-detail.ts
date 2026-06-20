import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IOrder, OrderStatus } from '../../models/iorder';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})
export class OrderDetail implements OnInit {
  order: IOrder | null = null;
  statuses: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  selectedStatus: OrderStatus = 'Pending';
  note = '';
  error = '';

  constructor(private route: ActivatedRoute, private orders: OrderService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.orders.getOrder(id).subscribe({
      next: (response) => { this.order = response.data; this.selectedStatus = response.data.status; },
      error: (err) => this.error = err?.error?.message || 'Failed to load order',
    });
  }

  badge(status: string) {
    return { Pending: 'text-bg-secondary', Confirmed: 'text-bg-info', Processing: 'text-bg-primary', Shipped: 'text-bg-warning', Delivered: 'text-bg-success', Cancelled: 'text-bg-danger' }[status] || 'text-bg-secondary';
  }

  updateStatus() {
    if (!this.order) return;
    this.orders.updateStatus(this.order._id, this.selectedStatus, this.note).subscribe({
      next: (response) => { this.order = response.data; this.note = ''; },
      error: (err) => this.error = err?.error?.message || 'Failed to update order',
    });
  }
}
