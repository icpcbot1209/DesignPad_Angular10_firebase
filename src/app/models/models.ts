import { ItemType } from './enums';
import { UserRole } from '../shared/auth.roles';
import { Data } from '@angular/router';

export interface Item {
  type: ItemType;
  pageId: number;
  itemId: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  clipStyle?: any;
  selected?: boolean;
  hovered?: boolean;
  url?: string;
  thumbnail?: string;
  filter?: string;
  text?: string;
  fontSize?: string;
  fontFamily?: string;
  SVGElement?: string;
  color?: [];
  colorAndIndex?: {};
  lineHeight?: string;
  letterSpacing?: string;
  quillData?;
  textShadow?;
  textStroke?;
  curveText?;
  isCurve?;
  angel?;
  textOpacity?;
  curveOpacity?;
  zIndex;
  clipPathToNumber?: number[];
  onPlayButton?: boolean;
  onPlayVideo?: boolean;
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

export interface AssetElement {
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

export interface AssetMusic {
  uid?: string;
  downloadURL: string;
  path: string;
  thumbnail: string;
  timestamp: number;
  userId: string;
  tags: string[];
  name: string;
  duration;
}

export interface AssetVideo {
  uid?: string;
  downloadURL: string;
  path: string;
  thumbnail: string;
  width: number;
  height: number;
  timestamp: number;
  userId: string;
  tags: string[];
  duration;
}

export interface UserData {
  docId?: string;
  uid: string;
  displayName: string;
  role: UserRole;
  template: UploadUserTemplate[];
}

export interface AdminTemplates {
  docId?: string;
  design: Design;
  thumbnail: string;
  width: number;
  height: number;
}

export interface UploadUserTemplate {
  design: Design;
  thumbnail: string;
  width: number;
  height: number;
  timestamp: number;
}

export interface UndoRedo {
  maxLength: number;
  position: number;
  temp: any[];
}
