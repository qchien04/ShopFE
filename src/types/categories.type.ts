export interface Category {
  id: number;
  name: string;
  description: string;
  icon:string;
  slug: string;
  image: string;
  parentId?: number;
  children?: Category[];
}