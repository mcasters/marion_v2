/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-empty-object-type */

import { Prisma, User } from "@@/prisma/generated/client";
import { JSX } from "react";
import { LABEL, META } from "@/constants/admin.ts";

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

export interface Image {
  filename: string;
  width: number;
  height: number;
  isMain: boolean;
}

export interface Category {
  id: number;
  key: string;
  value: string;
  content: {
    title: string;
    text: string;
    image: Image;
  };
}

export interface Work {
  id: number;
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING;
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

export interface Post {
  id: number;
  type: Type.POST;
  title: string;
  date: Date;
  text: string;
  published: boolean;
  viewCount: number;
  images: Image[];
}

export interface Admin {
  id: number;
  type: Type;
  modifiable: boolean;
}

export interface AdminCategory extends Category {
  type: Type.CATEGORY;
  workType: Type.PAINTING | Type.SCULPTURE | Type.DRAWING;
  images: Image[];
  count: number;
  modifiable: boolean;
}

export interface AdminWork extends Work {
  modifiable: boolean;
}

export interface AdminPost extends Post {
  modifiable: boolean;
}

export interface Message {
  id: number;
  date: Date;
  dateUpdated: Date | null;
  text: string;
  author: Prisma.UserGetPayload<{
    omit: { password: true };
  }>;
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

export type Label = (typeof LABEL)[keyof typeof LABEL];

export type Meta = (typeof META)[keyof typeof META];

export type ContentFull = {
  label: Label;
  title: string | null;
  text: string;
  images: Image[];
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

export type FileInfo = {
  filename: string;
  width: number;
  height: number;
  isMain: boolean;
};

export type Thumbnail = {
  filename: string;
  path: string;
};

export type Filter = {
  categoryFilter: number;
  yearFilter: number;
  isOutFilter: number;
};
