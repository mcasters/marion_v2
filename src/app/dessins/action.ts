"use server";

import { db } from "@/db";
import { drawing, TYPE } from "@/db/schema.ts";
import { asc } from "drizzle-orm";
import { DrawingCategory, Work } from "@/lib/type.ts";
import { getNoCategory } from "@/lib/utils/commonUtils.ts";
import { notFound } from "next/dist/client/components/not-found";
import { createWorkObject } from "@/lib/utils/actionUtils.ts";

export async function getDrawingYears(): Promise<number[]> {
  const dbData = await db
    .selectDistinct({
      date: drawing.date,
    })
    .from(drawing)
    .orderBy(asc(drawing.date));

  const years: number[] = [];
  dbData.forEach((item) => years.push(new Date(item.date).getFullYear()));

  return [...new Set(years)];
}

export const getDrawingCategories = async (): Promise<DrawingCategory[]> => {
  const categories = await db.query.drawingCategory.findMany({
    where: { drawings: true },
    orderBy: { value: "desc" },
  });

  const drawingWithNoCategory = await db.query.drawing.findFirst({
    where: { categoryId: { isNull: true } },
  });

  if (drawingWithNoCategory)
    categories.push(getNoCategory(TYPE.DRAWING) as DrawingCategory);
  return categories;
};

export async function getDrawingWorksByYear(year: string): Promise<Work[]> {
  const dbData = await db.query.drawing.findMany({
    where: {
      date: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      },
    },
    orderBy: { date: "desc" },
  });

  return dbData.map((data) => createWorkObject(data, TYPE.DRAWING));
}

export async function getDrawingCategory(
  categoryKey: string,
): Promise<DrawingCategory | null> {
  if (categoryKey === "no-category")
    return getNoCategory(TYPE.DRAWING) as DrawingCategory;

  const category = await db.query.drawingCategory.findFirst({
    where: { key: categoryKey },
  });
  return !category ? notFound() : category;
}

export async function getDrawingWorksByCategory(
  categoryKey: string,
): Promise<{ category: DrawingCategory; works: Work[] }> {
  if (categoryKey === "no-category") {
    const category = getNoCategory(TYPE.DRAWING) as DrawingCategory;
    const drawings = await db.query.drawing.findMany({
      where: { categoryId: { isNull: true } },
      orderBy: { date: "desc" },
    });
    const works = drawings.map((data) => createWorkObject(data, TYPE.DRAWING));
    return { category, works };
  } else {
    const result = await db.query.drawingCategory.findFirst({
      where: { key: categoryKey },
      with: {
        drawings: {
          orderBy: { date: "desc" },
        },
      },
    });
    if (result) {
      const { drawings, ...rest } = result;
      return {
        category: rest,
        works: drawings.map((data) => createWorkObject(data, TYPE.DRAWING)),
      };
    }
  }
  return notFound();
}
