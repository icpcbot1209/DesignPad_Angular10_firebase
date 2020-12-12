import { ItemType } from './enums';

export interface Item {
  type: ItemType;
  pageId: number;
  itemId: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
  flipX?: boolean;
  flipY?: boolean;
  clipStyle?: any;
  selected?: boolean;
  hovered?: boolean;
  url?: string;
  thumbnail?: string;
  filter?: string;
  text?: string;
  font?: string;
}

export interface Page {
  title: string;
  items: Item[];
}

export interface Design {
  uid: string;
  title: string;
  category: Category;
  thumbnail: string;
  pages: Page[];
}

export interface Category {
  uid: string;
  title: string;
  size: { x: number; y: number };
  categoryType: CategoryType;
  thumbnail: string;
}

export interface CategoryType {
  uid: string;
  title: string;
}

export interface AssetImage {
  uid?: string;
  downloadURL: string;
  path: string;
  thumbnail: string;
  width: number;
  height: number;
  timestamp: number;
  userId: string;
  tags: string[];
}
