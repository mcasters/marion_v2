"use server";

import { db } from "@/db";
import { painting, TYPE } from "@/db/schema.ts";
import { asc } from "drizzle-orm";
import { PaintingCategory, Work } from "@/lib/type.ts";
import { getNoCategory } from "@/lib/utils/commonUtils.ts";
import { notFound } from "next/dist/client/components/not-found";
import { createWorkObject } from "@/lib/utils/actionUtils.ts";

export async function getPaintingYears(): Promise<number[]> {
  const dbData = await db
    .selectDistinct({
      date: painting.date,
    })
    .from(painting)
    .orderBy(asc(painting.date));

  const years: number[] = [];
  dbData.forEach((item) => years.push(new Date(item.date).getFullYear()));

  return [...new Set(years)];
}

export const getPaintingCategories = async (): Promise<PaintingCategory[]> => {
  const categories = await db.query.paintingCategory.findMany({
    where: { paintings: true },
    orderBy: { value: "desc" },
  });

  const paintingWithNoCategory = await db.query.painting.findFirst({
    where: { categoryId: { isNull: true } },
  });

  if (paintingWithNoCategory)
    categories.push(getNoCategory(TYPE.PAINTING) as PaintingCategory);
  return categories;
};

export async function getPaintingWorksByYear(year: string): Promise<Work[]> {
  const dbData = await db.query.painting.findMany({
    where: {
      date: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      },
    },
    orderBy: { date: "desc" },
  });

  return dbData.map((data) => createWorkObject(data, TYPE.PAINTING));
}

export async function getPaintingCategory(
  categoryKey: string,
): Promise<PaintingCategory | null> {
  if (categoryKey === "no-category")
    return getNoCategory(TYPE.PAINTING) as PaintingCategory;

  const category = await db.query.paintingCategory.findFirst({
    where: { key: categoryKey },
  });
  return !category ? notFound() : category;
}

export async function getPaintingWorksByCategory(
  categoryKey: string,
): Promise<{ category: PaintingCategory; works: Work[] }> {
  if (categoryKey === "no-category") {
    const category = getNoCategory(TYPE.PAINTING) as PaintingCategory;
    const paintings = await db.query.painting.findMany({
      where: { categoryId: { isNull: true } },
      orderBy: { date: "desc" },
    });
    const works = paintings.map((data) =>
      createWorkObject(data, TYPE.PAINTING),
    );
    return { category, works };
  } else {
    const result = await db.query.paintingCategory.findFirst({
      where: { key: categoryKey },
      with: {
        paintings: {
          orderBy: { date: "desc" },
        },
      },
    });
    if (result) {
      const { paintings, ...rest } = result;
      return {
        category: rest,
        works: paintings.map((data) => createWorkObject(data, TYPE.PAINTING)),
      };
    }
  }
  return notFound();
}
