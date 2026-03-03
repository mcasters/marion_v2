"use server";

import { Drawing, Painting, Prisma } from "@@/prisma/generated/client";
import { Category, Post, Type, Work } from "@/lib/type";

import prisma from "@/lib/prisma.ts";
import {
  createCategoryObject,
  createPostObject,
  createWorkObject,
  createWorkObjectFromSculpture,
} from "@/app/actions/item-post/utils.ts";
import { SculptureGetPayload } from "@@/prisma/generated/models/Sculpture.ts";
import { getNoCategory } from "@/lib/utils/commonUtils.ts";
import { notFound } from "next/dist/client/components/not-found";

export async function getYears(
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
): Promise<number[]> {
  let dbData;
  switch (type) {
    case Type.PAINTING: {
      dbData = await prisma.painting.findMany({
        distinct: ["date"],
        select: {
          date: true,
        },
        orderBy: { date: "asc" },
      });
      break;
    }
    case Type.SCULPTURE: {
      dbData = await prisma.sculpture.findMany({
        distinct: ["date"],
        select: {
          date: true,
        },
        orderBy: { date: "asc" },
      });
      break;
    }
    case Type.DRAWING: {
      dbData = await prisma.drawing.findMany({
        distinct: ["date"],
        select: {
          date: true,
        },
        orderBy: { date: "asc" },
      });
      break;
    }
  }
  const years: number[] = [];
  dbData.forEach((item) => years.push(new Date(item.date).getFullYear()));

  return [...new Set(years)];
}

export async function getCategories(
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
): Promise<Category[]> {
  let dbData:
    | Prisma.PaintingCategoryGetPayload<{
        include: { content: true };
      }>[]
    | Prisma.SculptureCategoryGetPayload<{
        include: { content: true };
      }>[]
    | Prisma.DrawingCategoryGetPayload<{
        include: { content: true };
      }>[];
  let noCategory;
  switch (type) {
    case Type.PAINTING: {
      dbData = await prisma.paintingCategory.findMany({
        include: { content: true },
        where: {
          paintings: {
            some: {},
          },
        },
        orderBy: { value: "desc" },
      });

      noCategory = !!(await prisma.painting.findFirst({
        where: { category: null },
      }));
      break;
    }
    case Type.SCULPTURE: {
      dbData = await prisma.sculptureCategory.findMany({
        include: { content: true },
        where: {
          sculptures: {
            some: {},
          },
        },
        orderBy: { value: "desc" },
      });
      noCategory = !!(await prisma.sculpture.findFirst({
        where: { category: null },
      }));
      break;
    }
    case Type.DRAWING: {
      dbData = await prisma.drawingCategory.findMany({
        include: { content: true },
        where: {
          drawings: {
            some: {},
          },
        },
        orderBy: { value: "desc" },
      });
      noCategory = !!(await prisma.drawing.findFirst({
        where: { category: null },
      }));
      break;
    }
  }
  return createCategoryObject(dbData, noCategory);
}

export async function getWorksByYear(
  year: string,
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
): Promise<Work[]> {
  let dbData:
    | Painting[]
    | Drawing[]
    | SculptureGetPayload<{ include: { images: true } }>[];
  switch (type) {
    case Type.PAINTING: {
      dbData = await prisma.painting.findMany({
        where: {
          date: {
            gte: new Date(`${year}-01-01`),
            lte: new Date(`${year}-12-31`),
          },
        },
        orderBy: { date: "desc" },
      });
      return createWorkObject(dbData, Type.PAINTING);
    }
    case Type.SCULPTURE: {
      dbData = await prisma.sculpture.findMany({
        where: {
          date: {
            gte: new Date(`${year}-01-01`),
            lte: new Date(`${year}-12-31`),
          },
        },
        include: { images: true },
        orderBy: { date: "desc" },
      });
      return createWorkObjectFromSculpture(dbData);
    }
    case Type.DRAWING: {
      dbData = await prisma.drawing.findMany({
        where: {
          date: {
            gte: new Date(`${year}-01-01`),
            lte: new Date(`${year}-12-31`),
          },
        },
        orderBy: { date: "desc" },
      });
      return createWorkObject(dbData, Type.DRAWING);
    }
  }
}

export async function getCategory(
  categoryKey: string,
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
): Promise<Category | null> {
  if (categoryKey === "no-category") return getNoCategory();

  let dbData:
    | Prisma.PaintingCategoryGetPayload<{
        include: { content: true };
      }>
    | Prisma.SculptureCategoryGetPayload<{
        include: { content: true };
      }>
    | Prisma.DrawingCategoryGetPayload<{
        include: { content: true };
      }>
    | null;
  switch (type) {
    case Type.PAINTING: {
      dbData = await prisma.paintingCategory.findFirst({
        include: { content: true },
        where: {
          key: categoryKey,
        },
      });
      break;
    }
    case Type.SCULPTURE: {
      dbData = await prisma.sculptureCategory.findFirst({
        include: { content: true },
        where: {
          key: categoryKey,
        },
      });
      break;
    }
    case Type.DRAWING: {
      dbData = await prisma.drawingCategory.findFirst({
        include: { content: true },
        where: {
          key: categoryKey,
        },
      });
      break;
    }
  }
  if (!dbData) return notFound();
  return createCategoryObject([dbData], false)[0];
}

export async function getWorksByCategory(
  categoryKey: string,
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
): Promise<Work[]> {
  switch (type) {
    case Type.PAINTING: {
      const dbData: Painting[] = await prisma.painting.findMany({
        where: {
          category: categoryKey === "no-category" ? null : { key: categoryKey },
        },
        orderBy: { date: "desc" },
      });
      return createWorkObject(dbData, Type.PAINTING);
    }
    case Type.SCULPTURE: {
      const dbData: Prisma.SculptureGetPayload<{
        include: { images: true };
      }>[] = await prisma.sculpture.findMany({
        where: {
          category: categoryKey === "no-category" ? null : { key: categoryKey },
        },
        include: { images: true },
        orderBy: { date: "desc" },
      });
      return createWorkObjectFromSculpture(dbData);
    }
    case Type.DRAWING: {
      const dbData: Drawing[] = await prisma.drawing.findMany({
        where: {
          category: categoryKey === "no-category" ? null : { key: categoryKey },
        },
        orderBy: { date: "desc" },
      });
      return createWorkObject(dbData, Type.DRAWING);
    }
  }
}

export async function getPosts(): Promise<Post[]> {
  const dbData: Prisma.PostGetPayload<{
    include: { images: true };
  }>[] = await prisma.post.findMany({
    include: { images: true },
    orderBy: { title: "desc" },
  });

  return createPostObject(dbData);
}
