"use server";

import { db } from "@/db";
import { sculpture, sculptureImage, TYPE } from "@/db/schema.ts";
import { and, asc, eq, gte, isNull, lte } from "drizzle-orm";
import { SculptureCategory, Work } from "@/lib/type.ts";
import { getNoCategory } from "@/lib/utils/commonUtils.ts";
import { notFound } from "next/dist/client/components/not-found";
import {
  aggregateSculptureRows,
  createSculptureWorkObject,
} from "@/lib/utils/actionUtils.ts";

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
  const rows = await db
    .select({
      sculpture: sculpture,
      sculptureImage: sculptureImage,
    })
    .from(sculpture)
    .where(
      and(
        gte(sculpture.date, new Date(`${year}-01-01`)),
        lte(sculpture.date, new Date(`${year}-12-31`)),
      ),
    )
    .innerJoin(sculptureImage, eq(sculptureImage.sculptureId, sculpture.id))
    .orderBy(asc(sculpture.date));

  const result = aggregateSculptureRows(rows);
  return createSculptureWorkObject(result);
}

export async function getSculptureCategory(
  categoryKey: string,
): Promise<SculptureCategory | null> {
  let category: SculptureCategory | undefined;

  if (categoryKey === "no-category")
    category = getNoCategory(TYPE.SCULPTURE) as SculptureCategory;
  else
    category = await db.query.sculptureCategory.findFirst({
      where: { key: categoryKey },
    });
  return category ? category : notFound();
}

export async function getSculptureWorksByCategory(
  categoryKey: string,
): Promise<{ category: SculptureCategory; works: Work[] }> {
  let category: SculptureCategory | undefined;
  let rows;

  if (categoryKey === "no-category") {
    category = getNoCategory(TYPE.SCULPTURE) as SculptureCategory;
    rows = await db
      .select({
        sculpture: sculpture,
        sculptureImage: sculptureImage,
      })
      .from(sculpture)
      .where(isNull(sculpture.categoryId))
      .innerJoin(sculptureImage, eq(sculptureImage.sculptureId, sculpture.id))
      .orderBy(asc(sculpture.date));
  } else {
    category = await db.query.sculptureCategory.findFirst({
      where: { key: categoryKey },
    });
    if (category) {
      rows = await db
        .select({
          sculpture: sculpture,
          sculptureImage: sculptureImage,
        })
        .from(sculpture)
        .where(eq(sculpture.categoryId, category.id))
        .innerJoin(sculptureImage, eq(sculptureImage.sculptureId, sculpture.id))
        .orderBy(asc(sculpture.date));
    }
  }

  if (rows) {
    const result = aggregateSculptureRows(rows);
    return category
      ? { category, works: createSculptureWorkObject(result) }
      : notFound();
  }
  return notFound();
}
