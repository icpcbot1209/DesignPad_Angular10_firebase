export interface TextOne {
  text: string;
  font: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface ImageOne {
  url: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface Page {
  title: string;
  imageOnes: ImageOne[];
  textOnes: TextOne[];
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
