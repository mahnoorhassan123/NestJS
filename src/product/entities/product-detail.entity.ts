import { ImageEntity } from "./image.entity";

export class ProductDetailEntity {
  productDetailId: number;
  productId: number;
  name: string;
  url: string;
  isActive: boolean;
  createdAt: Date | null;

   images?: ImageEntity[];
}