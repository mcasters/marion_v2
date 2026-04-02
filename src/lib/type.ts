/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-empty-object-type */

import { JSX } from "react";
import { KEY_META } from "@/constants/admin.ts";
import {
  content,
  contentImage,
  drawing,
  drawingCategory,
  meta,
  painting,
  paintingCategory,
  post,
  postImage,
  presetColor,
  sculpture,
  sculptureCategory,
  sculptureImage,
  theme,
  TYPE,
} from "@/db/schema.ts";

type StringKeys<T> = {
  [k in keyof T]: T[k] extends string ? k : never;
}[keyof T];
export type OnlyString<T> = { [k in StringKeys<T>]: boolean };

export type Painting = typeof painting.$inferSelect;
export type Sculpture = typeof sculpture.$inferSelect & {
  images: (typeof sculptureImage.$inferSelect)[];
};
export type Drawing = typeof drawing.$inferSelect;
export type Post = typeof post.$inferSelect & {
  images: (typeof postImage.$inferSelect)[];
};

export type PaintingCategory = typeof paintingCategory.$inferSelect;
export type SculptureCategory = typeof sculptureCategory.$inferSelect;
export type DrawingCategory = typeof drawingCategory.$inferSelect;
export type Category = PaintingCategory | SculptureCategory | DrawingCategory;

export type Theme = typeof theme.$inferSelect;
export type PresetColor = typeof presetColor.$inferSelect;

export type Content = typeof content.$inferSelect & {
  images: (typeof contentImage.$inferSelect)[];
};

export type Meta = typeof meta.$inferSelect;

export interface Admin {
  id: number;
  type: TYPE;
}

export type AdminCategory = Category & {
  filenames: string[];
  count: number;
};

export interface Image {
  id: number;
  filename: string;
  width: number;
  height: number;
  isMain: boolean;
}

export type FileInfo = {
  filename: string;
  width: number;
  height: number;
  isMain: boolean;
};

export interface Work {
  id: number;
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING;
  title: string;
  date: Date;
  technique: string;
  description: string;
  height: number;
  width: number;
  length: number;
  isToSell: boolean;
  price: number | null;
  sold: boolean;
  images: Image[];
  categoryId: number | null;
  isOut: boolean;
  outInformation: string;
}

export interface User {
  id: number;
  email: string;
  isAdmin: boolean;
}

export type Session = {
  user: User;
};

export interface Message {
  id: number;
  date: Date;
  dateUpdated: Date | null;
  text: string;
  author: User;
}

export enum Layout {
  MONO,
  DOUBLE,
  MULTIPLE,
  SCULPTURE,
}

export enum ItemDarkBackground {
  FALSE,
  TRUE,
}

export enum HomeLayout {
  PLAIN,
  NAV,
}

export type KeyMeta = (typeof KEY_META)[keyof typeof KEY_META];

export interface Photo {
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  date: Date;
  isMain: boolean;
}

export type PhotoTab = {
  sm: Photo[];
  md: Photo[];
  lg: Photo[];
};

export interface PhotoEnhanced extends Photo {
  item: Work;
}

export type PhotoTabEnhanced = {
  sm: PhotoEnhanced[];
  md: PhotoEnhanced[];
  lg: PhotoEnhanced[];
};

export type ThemeTarget = {
  background: string;
  text: string;
  link: string;
  linkHover: string;
};

export type ThemeGenTarget = {
  lineColor: string;
  titleColor: string;
  lightbox: string;
  lightboxText: string;
};

export type ThemePage = {
  menu1: ThemeTarget;
  menu2: ThemeTarget;
  main: ThemeTarget;
  footer: ThemeTarget;
};

export type StructTheme = {
  general: ThemeGenTarget;
  home: ThemePage;
  work: ThemePage;
  other: ThemePage;
};

export type DragListElement = {
  id: number;
  element: JSX.Element;
  order: number;
};

export type Filter = {
  categoryFilter: number;
  yearFilter: number;
  isOutFilter: number;
};
