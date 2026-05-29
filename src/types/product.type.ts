import type { Category } from "./categories.type";
import type { Brand } from "./entity.type";

export interface ProductImage {
  id?:number;
  imageUrl:string;
}

export interface ProductVariant{
  id: number;
  productId: number;
  name: string;

  price: number;
  salePrice: number;
  stockQuantity: number;
  mainImage: string;
  attributes:string;
}




export interface Product {
  id: number;
  name: string;

  slug: string;
  price: number;
  salePrice: number;
  stockQuantity: number;
  mainImage: string;

  category?: Category;
  brand?:Brand;
  brandName: string;
  viewCount?: number;
  soldCount?: number;
  images:ProductImage[];
  shortDescription:string;
  fullDescription:string;

  productVariants:ProductVariant[];
}