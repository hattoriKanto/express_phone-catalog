import { JsonValue } from '@prisma/client/runtime/library';

export type Description = {
  title: string;
  text: string[];
};

export type Product = {
  id: number;
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
  camera: string | null;
  zoom: string | null;
  cell: string[];
};
