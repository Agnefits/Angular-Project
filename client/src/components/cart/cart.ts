import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
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
  cart = signal<CartData | null>(null);
  loading = signal(false);
  processingPayment = signal(false);
  error = signal('');
  success = signal('');
  paymentMethod = signal<PaymentMethod>('cash_on_delivery');

  items = computed(() => (this.cart()?.products || []).filter((item) => !!item.productId));
  
  totalPrice = computed(() => this.items().reduce((total, item) => total + (item.productId?.price || 0) * item.quantity, 0));

  submitDisabled = computed(() => this.loading() || this.processingPayment() || !this.items().length);

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.loading.set(true);
    this.error.set('');
    this.cartService.getCart().subscribe({
      next: (response) => {
        this.cart.set(response.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.cart.set(null);
        this.loading.set(false);
        if (err?.status !== 404) {
          this.error.set(err?.error?.message || 'Failed to load cart');
        }
      },
    });
  }

  remove(productId?: string) {
    if (!productId || this.processingPayment()) return;
    this.cartService.removeFromCart(productId).subscribe({
      next: (response) => this.cart.set(response.data || null),
      error: (err) => this.error.set(err?.error?.message || 'Failed to remove item'),
    });
  }

  checkout() {
    if (this.submitDisabled()) return;
    this.success.set('');
    this.error.set('');
    this.processingPayment.set(true);

    this.cartService.checkout(this.paymentMethod()).subscribe({
      next: (response) => {
        this.processingPayment.set(false);
        this.success.set(response.message);
        this.cart.set(null);
      },
      error: (err) => {
        this.processingPayment.set(false);
        this.error.set(err?.error?.message || 'Failed to place order');
      },
    });
  }
}

