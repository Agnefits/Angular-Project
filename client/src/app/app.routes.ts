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
import { Cart } from '../components/cart/cart';
import { Dashboard } from '../components/dashboard/dashboard';
import { Favorites } from '../components/favorites/favorites';
import { Orders } from '../components/orders/orders';
import { OrderDetail } from '../components/order-detail/order-detail';
import { AdminDashboard } from '../components/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: 'app',
    component: Mainlayout,
    children: [
      { path: '', component: Home },
      { path: 'add', component: Add, canActivate: [AuthGuard] },
      { path: 'add/:id', component: Add, canActivate: [AuthGuard] },
      { path: 'products', component: Products },
      { path: 'products/:id', component: DetailProduct },
      { path: 'favorites', component: Favorites, canActivate: [AuthGuard] },
      { path: 'cart', component: Cart, canActivate: [AuthGuard] },
      { path: 'orders', component: Orders, canActivate: [AuthGuard] },
      { path: 'orders/:id', component: OrderDetail, canActivate: [AuthGuard] },
      { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
      { path: 'admin', component: AdminDashboard, canActivate: [AdminGuard] },
    ],
  },
  { path: 'signup', component: Singup },
  { path: 'login', component: Login },
  { path: '**', component: Error },
];
