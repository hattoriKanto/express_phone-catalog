import { Product } from '@prisma/client';

export type ProductCard = Pick<
  Product,
  | 'id'
  | 'category'
  | 'slug'
  | 'name'
  | 'priceRegular'
  | 'priceDiscount'
  | 'screen'
  | 'capacity'
  | 'color'
  | 'ram'
  | 'year'
> & { image: string };
