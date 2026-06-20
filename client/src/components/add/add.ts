import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IProduct } from '../../models/iproduct';
import { StaticData } from './../../services/static-data';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './add.html',
  styleUrl: './add.css',
})
export class Add implements OnInit {
  newPro: Partial<IProduct> = {
    stock: 0,
  };
  id: number = 0;
  error = '';

  constructor(private staticData: StaticData, private router: Router, private active: ActivatedRoute) {
    this.getID();
  }

  ngOnInit() {
    if (this.id) {
      this.staticData.getProById(this.id).subscribe({
        next: (pro) => {
          this.newPro = pro;
        },
        error: () => {
          this.router.navigate(['/app/dashboard']);
        },
      });
    }
  }

  handleSubmit() {
    if (!this.newPro) return;

    const request = this.id ? this.staticData.editPro(this.id, this.newPro) : this.staticData.createPro(this.newPro);

    request.subscribe({
      next: () => {
        this.router.navigate(['/app/dashboard']);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to save product';
      },
    });
  }

  getID() {
    this.id = Number(this.active.snapshot.paramMap.get('id'));
  }
}
