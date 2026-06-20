import { Routes } from '@angular/router';
import { Products } from '../components/products/products';
import { Add } from '../components/add/add';
import { Error } from '../components/error/error';
import { Mainlayout } from '../components/mainlayout/mainlayout';
import { Home } from '../components/home/home';
import { DetailProduct } from '../components/detail-product/detail-product';
import { Singup } from '../components/singup/singup';
import { Login } from '../components/login/login';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  {
    path: 'app',
    component: Mainlayout,
    canActivateChild: [AuthGuard],
    children: [
      { path: '', component: Home },
      { path: 'add', component: Add },
      { path: 'add/:id', component: Add, canActivate: [AdminGuard] },
      { path: 'products', component: Products },
      { path: 'products/:id', component: DetailProduct },
    ],
  },
  { path: 'signup', component: Singup },
  { path: 'login', component: Login },
  { path: '**', component: Error },
];
