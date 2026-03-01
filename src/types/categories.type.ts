export interface Category {
  id: number;
  name: string;
  description: string;
  icon:string;
  slug: string;
  image: string;
  active: boolean;
  parentId?: number;
  children?: Category[];
}