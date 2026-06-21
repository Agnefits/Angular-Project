import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService, IUser } from '../../services/admin.service';
import { IProduct } from '../../models/iproduct';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  users: IUser[] = [];
  products: IProduct[] = [];
  error = '';

  constructor(private admin: AdminService) {}

  ngOnInit() { this.load(); }

  load() {
    this.admin.getUsers().subscribe({ next: (r) => this.users = r.data, error: (e) => this.error = e?.error?.message || 'Failed to load users' });
    this.admin.getProducts().subscribe({ next: (products) => this.products = products, error: () => {} });
  }

  deleteUser(id: string) {
    this.admin.deleteUser(id).subscribe({ next: () => this.users = this.users.filter((u) => u._id !== id), error: (e) => this.error = e?.error?.message || 'Failed to delete user' });
  }

  deleteProduct(id?: number) {
    if (!id) return;
    this.admin.deleteProduct(id).subscribe({ next: () => this.products = this.products.filter((p) => p.id !== id), error: (e) => this.error = e?.error?.message || 'Failed to delete product' });
  }
}
