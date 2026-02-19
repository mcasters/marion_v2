/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-empty-object-type */

import { Prisma, User } from "@@/prisma/generated/client";
import prisma from "./prisma.ts";
import { JSX } from "react";

type StringKeys<T> = {
  [k in keyof T]: T[k] extends string ? k : never;
}[keyof T];
export type OnlyString<T> = { [k in StringKeys<T>]: boolean };

export enum Type {
  PAINTING = "peinture",
  SCULPTURE = "sculpture",
  POST = "post",
  DRAWING = "dessin",
  CATEGORY = "catégorie",
}

type Painting = Prisma.Result<typeof prisma.painting, {}, any>; // With Image[] field
type Drawing = Prisma.Result<typeof prisma.drawing, {}, any>; // With Image[] field
type Sculpture = typeof prisma.sculpture; // No change - just to uniformise name
export type Work = Painting | Sculpture | Drawing;

export type CategoryContent = Prisma.Result<
  typeof prisma.categoryContent,
  {},
  any
>; // With Image field
export type Category = {
  id: number;
  key: string;
  value: string;
  content: CategoryContent;
};
export type CategoryFull = Category & {
  type: Type.CATEGORY;
  workType: Type.PAINTING | Type.SCULPTURE | Type.DRAWING;
  images: Image[];
  count: number;
};

export type Post = Prisma.Result<typeof prisma.post, {}, any>; // No change - just to uniformise name

export type Item = Work | Post | CategoryFull;

export type Message = {
  id: number;
  date: Date;
  dateUpdated: Date | null;
  text: string;
  author: User;
};

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

export type ContentFull = {
  id: number;
  label: string;
  title: string | null;
  text: string;
  images: Image[];
};

export type Image = {
  id: number;
  filename: string;
  width: number;
  height: number;
  isMain: boolean;
};

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

export type Session = {
  user: User;
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
