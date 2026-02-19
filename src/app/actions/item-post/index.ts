"use server";

import { Category, Post, Type, Work } from "@/lib/type";
import {
  KEYS,
  queryAllCategories,
  queryAllWorks,
  queryCategories,
  queryCategory,
  queryItemsByCategory,
  queryItemsByYear,
  queryNoCategory,
  queryYears,
} from "@/app/actions/item-post/queries";
import {
  getEmptyCategoryFull,
  getEmptyPost,
  getEmptyWork,
  getNoCategory,
} from "@/lib/utils/commonUtils";

import { cacheDatas } from "@/lib/utils/serverUtils";
import prisma from "@/lib/prisma.ts";

export async function getYears(
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
): Promise<number[]> {
  const years = await cacheDatas(() => queryYears(type), `${KEYS[type].years}`);

  return JSON.parse(JSON.stringify(years));
}

export async function getCategories(
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
): Promise<Category[]> {
  const categories = await cacheDatas(
    () => queryCategories(type),
    KEYS[type].categories,
  );

  const noCategory = await cacheDatas(
    () => queryNoCategory(type),
    KEYS[type].noCategory,
  );
  if (noCategory) categories.push(noCategory);

  return JSON.parse(JSON.stringify(categories));
}

export async function getItemsByYear(
  year: string,
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
): Promise<Work[]> {
  const items = await cacheDatas(
    () => queryItemsByYear(type, year),
    `${KEYS[type].itemsByYear}-${year}`,
  );

  return JSON.parse(JSON.stringify(items));
}

export async function getCategory(
  categoryKey: string,
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
): Promise<Category | null> {
  let category;

  if (categoryKey === "no-category") {
    category = getNoCategory();
  } else {
    category = await cacheDatas(
      () => queryCategory(type, categoryKey),
      `${KEYS[type].category}-${categoryKey}`,
    );
  }
  return JSON.parse(JSON.stringify(category));
}

export async function getItemsByCategory(
  categoryKey: string,
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
): Promise<Work[]> {
  const items = await cacheDatas(
    () => queryItemsByCategory(type, categoryKey),
    `${KEYS[type].itemsByCategory}-${categoryKey}`,
  );

  return JSON.parse(JSON.stringify(items));
}

export async function getPosts(): Promise<Post[]> {
  const posts = await cacheDatas(
    async () =>
      await prisma.post.findMany({
        include: { images: true },
        orderBy: { title: "desc" },
      }),
    "posts",
  );

  return JSON.parse(JSON.stringify(posts));
}

export async function getAdminPosts(): Promise<Post[]> {
  const posts = await cacheDatas(
    async () =>
      await prisma.post.findMany({
        include: { images: true },
        orderBy: { title: "desc" },
      }),
    "posts",
  );

  if (posts.length === 0) posts.push(getEmptyPost());

  return JSON.parse(JSON.stringify(posts));
}

export async function getAdminCategories(
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
): Promise<Category[]> {
  const res = await queryAllCategories(type);
  const noCategory = await queryNoCategory(type);

  if (noCategory) res.push(noCategory);

  if (res.length === 0) res.push(getEmptyCategoryFull(type));

  return JSON.parse(JSON.stringify(res));
}

export async function getAdminWorks(
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
): Promise<Work[]> {
  const items = await queryAllWorks(type);

  if (items.length === 0) items.push(getEmptyWork(type));

  return JSON.parse(JSON.stringify(items));
}
