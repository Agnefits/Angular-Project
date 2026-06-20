export interface IProduct {
  _id?: string;
  id?: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  stock: number;
  category: string;
  owner?: string;
}
