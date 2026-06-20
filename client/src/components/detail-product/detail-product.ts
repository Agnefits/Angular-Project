import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StaticData } from '../../services/static-data';
import { IProduct } from '../../models/iproduct';

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [],
  templateUrl: './detail-product.html',
  styleUrl: './detail-product.css',
})
export class DetailProduct implements OnInit {
  id: number = 0;
  pro: IProduct | null = null;

  constructor(private active: ActivatedRoute, private staticData: StaticData) {
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
}
