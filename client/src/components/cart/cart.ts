import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartData, CartService, PaymentMethod } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  cart: CartData | null = null;
  loading = false;
  error = '';
  success = '';
  paymentMethod: PaymentMethod = 'stripe';
  paymentMethodId = '';
  cardName = '';
  cardNumber = '';
  cardExpiry = '';
  cardCvc = '';

  constructor(private cartService: CartService) {}

  ngOnInit() { this.loadCart(); }

  get items() { return this.cart?.products || []; }

  get totalPrice() { return this.items.reduce((total, item) => total + (item.productId?.price || 0) * item.quantity, 0); }

  loadCart() {
    this.loading = true;
    this.error = '';
    this.cartService.getCart().subscribe({
      next: (response) => { this.cart = response.data; this.loading = false; },
      error: (err) => { this.cart = null; this.loading = false; if (err?.status !== 404) this.error = err?.error?.message || 'Failed to load cart'; },
    });
  }

  remove(productId?: string) {
    if (!productId) return;
    this.cartService.removeFromCart(productId).subscribe({ next: (response) => this.cart = response.data, error: (err) => this.error = err?.error?.message || 'Failed to remove item' });
  }

  checkout() {
    if (!this.items.length) return;
    this.success = '';
    this.error = '';
    if (this.paymentMethod === 'stripe' && !this.paymentMethodId.trim()) {
      this.error = 'Stripe payment method id is required.';
      return;
    }
    this.cartService.checkout(this.paymentMethod, this.paymentMethodId.trim()).subscribe({
      next: (response) => { this.success = response.message; this.cart = null; },
      error: (err) => this.error = err?.error?.message || 'Payment failed',
    });
  }
}
