import { Product } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

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

// type Description = {
//   text: string;
//   title: string;
// };

export interface ProductExpanded {
  id: number;
  slug: string;
  category: string;
  namespaceId: string;
  name: string;
  capacityAvailable: string[];
  capacity: string;
  priceRegular: number;
  priceDiscount: number;
  colorsAvailable: string[];
  color: string;
  images: string[];
  description: JsonValue[];
  screen: string;
  resolution: string;
  processor: string;
  ram: string;
  camera?: string | null;
  zoom?: string | null;
  cell: string[];
  year?: number | null;
}
