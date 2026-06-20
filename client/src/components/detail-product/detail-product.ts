import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StaticData } from '../../services/static-data';
import { IProduct } from '../../models/iproduct';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [NgIf],
  templateUrl: './detail-product.html',
  styleUrl: './detail-product.css',
})
export class DetailProduct implements OnInit {
  id: number = 0;
  pro: IProduct | null = null;
  message = '';
  error = '';

  constructor(private active: ActivatedRoute, private staticData: StaticData, private auth: AuthService, private cartService: CartService, private router: Router) {
    this.getID();
  }

  ngOnInit() {
    this.getPro();
  }

  getID() {
    this.id = Number(this.active.snapshot.paramMap.get('id'));
  }

  getPro() {
    this.staticData.getProById(this.id).subscribe({
      next: (product) => {
        this.pro = product;
      },
      error: () => {
        this.pro = null;
      },
    });
  }

  addToCart() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { msg: 'Please log in to buy this product' } });
      return;
    }

    if (!this.pro?._id) return;

    this.cartService.addToCart(this.pro._id, 1).subscribe({
      next: () => {
        this.message = 'Product added to cart';
        this.error = '';
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to add product to cart';
        this.message = '';
      },
    });
  }
}
