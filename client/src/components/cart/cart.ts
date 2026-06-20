import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartData, CartService, PaymentMethod } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  cart: CartData | null = null;
  loading = false;
  processingPayment = false;
  error = '';
  success = '';
  paymentMethod: PaymentMethod = 'cash_on_delivery';

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadCart();
  }

  get items() { return (this.cart?.products || []).filter((item) => !!item.productId); }

  get totalPrice() { return this.items.reduce((total, item) => total + (item.productId?.price || 0) * item.quantity, 0); }

  get submitDisabled() { return this.loading || this.processingPayment || !this.items.length; }

  loadCart() {
    this.loading = true;
    this.error = '';
    this.cartService.getCart().subscribe({
      next: (response) => { this.cart = response.data; this.loading = false; },
      error: (err) => { this.cart = null; this.loading = false; if (err?.status !== 404) this.error = err?.error?.message || 'Failed to load cart'; },
    });
  }

  remove(productId?: string) {
    if (!productId || this.processingPayment) return;
    this.cartService.removeFromCart(productId).subscribe({
      next: (response) => this.cart = response.data || null,
      error: (err) => this.error = err?.error?.message || 'Failed to remove item',
    });
  }

  checkout() {
    if (this.submitDisabled) return;
    this.success = '';
    this.error = '';
    this.processingPayment = true;

    this.cartService.checkout(this.paymentMethod).subscribe({
      next: (response) => {
        this.processingPayment = false;
        this.success = response.message;
        this.cart = null;
      },
      error: (err) => {
        this.processingPayment = false;
        this.error = err?.error?.message || 'Failed to place order';
      },
    });
  }
}
