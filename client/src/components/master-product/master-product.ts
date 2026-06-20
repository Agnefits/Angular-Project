import { Component } from '@angular/core';
import { Products } from '../products/products';

@Component({
  selector: 'app-master-product',
  standalone: true,
  imports: [ Products],
  templateUrl: './master-product.html',
  styleUrl: './master-product.css',
})
export class MasterProduct {}
