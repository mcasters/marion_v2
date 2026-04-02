"use server";

import { db } from "@/db";
import { sculpture, TYPE } from "@/db/schema.ts";
import { asc } from "drizzle-orm";
import { SculptureCategory, Work } from "@/lib/type.ts";
import { getNoCategory } from "@/lib/utils/commonUtils.ts";
import { notFound } from "next/dist/client/components/not-found";

export async function getSculptureYears(): Promise<number[]> {
  const dbData = await db
    .selectDistinct({
      date: sculpture.date,
    })
    .from(sculpture)
    .orderBy(asc(sculpture.date));

  const years: number[] = [];
  dbData.forEach((item) => years.push(new Date(item.date).getFullYear()));

  return [...new Set(years)];
}

export const getSculptureCategories = async (): Promise<
  SculptureCategory[]
> => {
  const categories = await db.query.sculptureCategory.findMany({
    where: { sculptures: true },
    orderBy: { value: "desc" },
  });

  const sculptureWithNoCategory = await db.query.sculpture.findFirst({
    where: { categoryId: { isNull: true } },
  });

  if (sculptureWithNoCategory)
    categories.push(getNoCategory(TYPE.SCULPTURE) as SculptureCategory);
  return categories;
};

export async function getSculptureWorksByYear(year: string): Promise<Work[]> {
  return await db.query.sculpture.findMany({
    with: { images: true },
    where: {
      date: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      },
    },
    orderBy: { date: "desc" },
  });
}

export async function getSculptureCategory(
  categoryKey: string,
): Promise<SculptureCategory | null> {
  if (categoryKey === "no-category")
    return getNoCategory(TYPE.SCULPTURE) as SculptureCategory;

  const category = await db.query.sculptureCategory.findFirst({
    where: { key: categoryKey },
  });
  return !category ? notFound() : category;
}

export async function getSculptureWorksByCategory(
  categoryKey: string,
): Promise<{ category: SculptureCategory; works: Work[] }> {
  if (categoryKey === "no-category") {
    const category = getNoCategory(TYPE.SCULPTURE) as SculptureCategory;
    const works = await db.query.sculpture.findMany({
      with: { images: true },
      where: { categoryId: { isNull: true } },
      orderBy: { date: "desc" },
    });
    return { category, works };
  } else {
    const result = await db.query.sculptureCategory.findFirst({
      where: { key: categoryKey },
      with: {
        sculptures: {
          with: { images: true },
          orderBy: { date: "desc" },
        },
      },
    });
    if (result) {
      const { sculptures, ...rest } = result;
      return { category: rest, works: sculptures };
    }
  }
  return notFound();
}
