/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-empty-object-type */

import { JSX } from "react";
import { KEY_META } from "@/constants/admin.ts";
import {
  content,
  drawingCategory,
  meta,
  paintingCategory,
  presetColor,
  sculptureCategory,
  theme,
  TYPE,
} from "@/db/schema.ts";

type StringKeys<T> = {
  [k in keyof T]: T[k] extends string ? k : never;
}[keyof T];
export type OnlyString<T> = { [k in StringKeys<T>]: boolean };

type Common = {
  id: number;
  title: string;
  date: Date;
  technique: string;
  description: string;
  height: number;
  width: number;
  isToSell: boolean;
  price: number | null;
  sold: boolean;
  categoryId: number | null;
  isOut: boolean;
  outInformation: string;
};

export type dbPainting = Common & {
  type: TYPE.PAINTING;
  imageFilename: string;
  imageWidth: number;
  imageHeight: number;
};
export type dbDrawing = Common & {
  type: TYPE.DRAWING;
  imageFilename: string;
  imageWidth: number;
  imageHeight: number;
};

export type WorkImage = {
  filename: string;
  width: number;
  height: number;
};

export type Work = Common & {
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING;
  length: number;
  images: WorkImage[];
};

export interface Image {
  filename: string;
  width: number;
  height: number;
  isMain?: boolean;
}

export type EnhancedImage = {
  work?: Work;
  littleScr?: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  title?: string;
  year?: number;
};

export type Post = {
  id: number;
  type: TYPE.POST;
  title: string;
  date: Date;
  text: string;
  images: Image[];
};

export type PaintingCategory = typeof paintingCategory.$inferSelect;
export type SculptureCategory = typeof sculptureCategory.$inferSelect;
export type DrawingCategory = typeof drawingCategory.$inferSelect;
export type Category = PaintingCategory | SculptureCategory | DrawingCategory;

export type Theme = typeof theme.$inferSelect;
export type PresetColor = typeof presetColor.$inferSelect;

export type Content = typeof content.$inferSelect & {
  images?: Image[];
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

export type FileInfo = {
  filename: string;
  width: number;
  height: number;
  isMain: boolean;
};

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
  author: { email: string } | null;
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
