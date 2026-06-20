import { Component, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { IProduct } from '../../models/iproduct';
import { NgClass, NgIf, SlicePipe } from '@angular/common';
import { Dark } from '../../Directive/dark';
import { Zoom } from '../../Directive/zoom';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Child } from '../child/child';
import { StaticData } from './../../services/static-data';
import { AuthService } from '../../services/auth.service';

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

  constructor(private staticData: StaticData, private auth: AuthService) {}

  get isAdmin() {
    return this.auth.isAdmin;
  }

  ngOnInit() {
    this.refreshProducts();
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
    if (v) {
      document.body.style.backgroundColor = 'rgb(32, 32, 32)';
    } else {
      document.body.style.backgroundColor = 'rgb(255, 255, 255)';
    }
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

  Total(count: any, price: number, number: number) {
    const selectedCount = Math.max(0, Number(count) || 0);
    const current = this.Filterlist()[number];
    if (!current || selectedCount === 0) return;

    const purchaseAmount = Math.min(selectedCount, current.stock);
    this.totalPrice += purchaseAmount * price;

    const updated = { ...current, stock: current.stock - purchaseAmount };
    const filteredList = [...this.Filterlist()];
    filteredList[number] = updated;
    this.Filterlist.set(filteredList);

    const allProducts = this.prdList().map((item) => (item.id === updated.id ? updated : item));
    this.prdList.set(allProducts);
    this.wantedAmount[number] = 0;
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
    this.wantedAmount = new Array(filtered.length).fill(0);
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
