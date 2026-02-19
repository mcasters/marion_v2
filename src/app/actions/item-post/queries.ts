// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Category, Type, Work } from "@/lib/type";
import { getNoCategory } from "@/lib/utils/commonUtils";
import { getItemModel } from "@/app/actions/item-post/utils";
import { getCategoryModel } from "@/app/actions/item-post/categories/utils";

export const KEYS = {
  [Type.PAINTING]: {
    items: "paintings",
    itemsByYear: "paintingsByYear",
    itemsByCategory: "paintingsByYear",
    noCategory: "paintingsWithNoCategory",
    categories: "paintingCategories",
    category: "paintingCategory",
    years: "paintingYears",
  },
  [Type.SCULPTURE]: {
    items: "sculptures",
    itemsByYear: "sculpturesByYear",
    itemsByCategory: "sculturesByYear",
    noCategory: "sculpturesWithNoCategory",
    categories: "sculptureCategories",
    category: "sculptureCategory",
    years: "sculptureYears",
  },
  [Type.DRAWING]: {
    items: "drawings",
    itemsByYear: "drawingsByYear",
    itemsByCategory: "drawingsByYear",
    noCategory: "drawingsWithNoCategory",
    categories: "drawingCategories",
    category: "drawingCategory",
    years: "drawingYears",
  },
};

export const queryYears = async (
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
): Promise<number[]> => {
  const model = getItemModel(type);

  const res = await model.findMany({
    distinct: ["date"],
    select: {
      date: true,
    },
    orderBy: { date: "asc" },
  });

  const years: number[] = [];
  res.forEach((item) => {
    const date = new Date(item.date);
    years.push(date.getFullYear());
  });

  return [...new Set(years)];
};

export const queryItemsByYear = async (
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
  year: string,
): Promise<Work[]> => {
  const model = getItemModel(type);

  return await model.findMany({
    where: {
      date: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      },
    },
    include: type === Type.SCULPTURE ? { images: true } : undefined,
    orderBy: { date: "desc" },
  });
};

export const queryItemsByCategory = async (
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
  categoryKey: string,
): Promise<Work[]> => {
  const model = getItemModel(type);

  return await model.findMany({
    where: {
      category: categoryKey === "no-category" ? null : { key: categoryKey },
    },
    include: type === Type.SCULPTURE ? { images: true } : undefined,
    orderBy: { date: "desc" },
  });
};

export const queryNoCategory = async (
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
): Promise<Category | null> => {
  const model = getItemModel(type);

  const items = await model.findMany({
    where: {
      category: null,
    },
  });
  return items.length > 0 ? getNoCategory() : null;
};

export const queryCategory = async (
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
  categoryKey: string,
): Promise<Category | null> => {
  const model = getCategoryModel(type);

  return await model.findUnique({
    where: { key: categoryKey },
    include: {
      content: true,
    },
  });
};

export const queryCategories = async (
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
): Promise<Category[]> => {
  const model = getCategoryModel(type);
  const whereClause =
    type === Type.PAINTING
      ? {
          paintings: {
            some: {},
          },
        }
      : type === Type.SCULPTURE
        ? {
            sculptures: {
              some: {},
            },
          }
        : {
            drawings: {
              some: {},
            },
          };

  return model.findMany({
    where: whereClause,
    include: { content: true },
  });
};

export const queryAllCategories = async (
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
): Promise<Category[]> => {
  const model = getCategoryModel(type);

  return model.findMany({
    include: {
      content: true,
    },
    orderBy: { value: "desc" },
  });
};

export const queryAllWorks = async (
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
): Promise<Work[]> => {
  const model = getItemModel(type);

  return await model.findMany({
    include: type === Type.SCULPTURE ? { images: true } : undefined,
    orderBy: { date: "desc" },
  });
};
