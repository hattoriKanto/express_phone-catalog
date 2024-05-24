import { JsonValue } from '@prisma/client/runtime/library';

export interface Product {
  id: number;
  category: string;
  slug: string;
  name: string;
  color: string;
  fullPrice: number;
  price: number;
  ram: string;
  images: string[];
}

export interface DetailedProduct extends Product {
  namespaceId: string;
  capacityAvailable: string[];
  capacity: string;
  colorsAvailable: string[];
  description: JsonValue[];
  screen: string;
  resolution: string;
  processor: string;
  camera?: string | null;
  zoom?: string | null;
  cell: string[];
  favorites?: Favorite[] | null;
  cartItems?: CartItem[] | null;
}

export interface User {
  id: number;
  username: string;
  password: string;
  email?: string;
  favorites: Favorite[];
  cartItems: CartItem[];
}

export interface Favorite {
  id: number;
  userId: number;
  productId: number;
  user: User;
  product: Product;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  user: User;
  product: Product;
}
