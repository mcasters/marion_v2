import { ContentFull } from "@/lib/type";
import prisma from "@/lib/prisma.ts";
import { Label } from "@@/prisma/generated/client";
import {
  getMiscellaneousDir,
  resizeAndSaveImage,
} from "@/lib/utils/serverUtils";

export const findOrCreateContent = async (
  label: Label,
): Promise<ContentFull> => {
  let BDContent = await prisma.content.findUnique({
    where: {
      label,
    },
    include: { images: true },
  });

  if (!BDContent) {
    BDContent = await prisma.content.create({
      data: {
        label,
        title: "",
        text: "",
        images: {},
      },
      include: { images: true },
    });
  }

  return BDContent;
};

export const updateText = async (id: number, text: string) => {
  await prisma.content.update({
    where: { id },
    data: { text },
  });
};

export const saveContentImage = async (
  id: number,
  file: File,
  title: string,
  isMain: boolean,
) => {
  const dir = getMiscellaneousDir();
  const fileInfo = await resizeAndSaveImage(file, title, dir);
  if (fileInfo) {
    await prisma.content.update({
      where: { id },
      data: {
        images: {
          create: {
            filename: fileInfo.filename,
            width: fileInfo.width,
            height: fileInfo.height,
            isMain,
          },
        },
      },
    });
  }
};
