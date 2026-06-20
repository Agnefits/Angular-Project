import { Component, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { IProduct } from '../../models/iproduct';
import { NgClass, NgIf, SlicePipe } from '@angular/common';
import { Dark } from '../../Directive/dark';
import { Zoom } from '../../Directive/zoom';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Child } from '../child/child';
import { StaticData } from './../../services/static-data';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgClass, NgIf, Dark, Zoom, SlicePipe, FormsModule, RouterLink, Child],
  templateUrl: './products.html',
  styleUrl: './products.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Products implements OnInit {
  prdList = signal<IProduct[]>([]);
  Filterlist = signal<IProduct[]>([]);
  ActiveDark = signal(false);
  extend: boolean[] = [];
  wantedAmount: number[] = [];
  totalPrice: number = 0;
  accending: boolean = false;
  decending: boolean = false;
  SelectedCategory: string = 'All';
  message = '';
  error = '';

  constructor(private staticData: StaticData, public auth: AuthService, private cartService: CartService, private router: Router, public favorites: FavoriteService) {}

  ngOnInit() {
    this.refreshProducts();
    if (this.auth.isLoggedIn()) {
      this.favorites.loadFavorites().subscribe({ error: () => this.favorites.clear() });
    }
  }

  refreshProducts() {
    this.staticData.loadProducts().subscribe({
      next: (all) => {
        this.prdList.set(all);
        this.filteration();
      },
      error: () => {
        this.prdList.set([]);
        this.Filterlist.set([]);
        this.extend = [];
        this.wantedAmount = [];
      },
    });
  }

  toggle() {
    const v = !this.ActiveDark();
    this.ActiveDark.set(v);
    document.body.style.backgroundColor = v ? 'rgb(32, 32, 32)' : 'rgb(255, 255, 255)';
  }

  seeMore(number: number = 0) {
    this.extend[number] = !this.extend[number];
  }

  addWantedAmount(number: number = 0) {
    const current = this.Filterlist()[number];
    if (current && this.wantedAmount[number] < current.stock) {
      this.wantedAmount[number]++;
    }
  }

  reduceWantedAmount(number: number = 0) {
    if (this.wantedAmount[number] > 0) {
      this.wantedAmount[number]--;
    }
  }

  addToCart(number: number) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { msg: 'Please log in to add products to your cart' } });
      return;
    }

    const current = this.Filterlist()[number];
    const quantity = Math.max(1, Number(this.wantedAmount[number]) || 1);
    if (!current?._id) return;

    this.cartService.addToCart(current._id, quantity).subscribe({
      next: () => {
        this.message = `${current.title} added to cart`;
        this.error = '';
        this.wantedAmount[number] = 0;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to add product to cart';
        this.message = '';
      },
    });
  }

  toggleFavorite(productId?: string) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { msg: 'Please log in to save favorites' } });
      return;
    }
    if (!productId) return;
    this.favorites.toggle(productId).subscribe({
      error: (err) => {
        this.error = err?.error?.message || 'Failed to update favorites';
      },
    });
  }

  deletePro(id: number) {
    this.staticData.deleteProById(id).subscribe({
      next: () => this.refreshProducts(),
    });
  }

  filteration() {
    const filtered = this.staticData.getFillteredPro(this.SelectedCategory, this.accending, this.decending);
    this.Filterlist.set(filtered);
    this.extend = new Array(filtered.length).fill(false);
    this.wantedAmount = new Array(filtered.length).fill(1);
  }

  accendingChecked() {
    this.accending = true;
    this.decending = false;
    this.filteration();
  }

  decendingChecked() {
    this.decending = true;
    this.accending = false;
    this.filteration();
  }
}

