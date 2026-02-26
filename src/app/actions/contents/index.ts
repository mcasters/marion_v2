"use server";
import prisma from "@/lib/prisma.ts";
import { ContentFull, Image } from "@/lib/type";

export const getContentsFull = async (): Promise<ContentFull[]> => {
  const dbData = await prisma.content.findMany({ include: { images: true } });

  const data = [] as ContentFull[];
  dbData.forEach((item) => {
    const images = [] as Image[];
    item.images.forEach((image) => {
      images.push({
        filename: image.filename,
        width: image.width,
        height: image.height,
        isMain: image.isMain,
      });
    });
    data.push({
      label: item.label,
      title: item.title,
      text: item.text,
      images,
    });
  });
  return data;
};
