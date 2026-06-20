import { IProduct } from './iproduct';

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'stripe' | 'cash_on_delivery';

export interface OrderItem {
  product: IProduct;
  owner?: { _id: string; username: string } | string;
  title: string;
  thumbnail?: string;
  price: number;
  quantity: number;
}

export interface OrderTracking {
  status: OrderStatus;
  note?: string;
  changedBy?: { username: string; role: string };
  changedAt: string;
}

export interface IOrder {
  _id: string;
  buyer: { _id: string; username: string } | string;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'failed';
  status: OrderStatus;
  tracking: OrderTracking[];
  createdAt: string;
}
