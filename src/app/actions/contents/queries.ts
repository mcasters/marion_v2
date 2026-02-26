import { ContentFull, Label } from "@/lib/type";
import prisma from "@/lib/prisma.ts";
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

export const updateText = async (label: Label, text: string) => {
  await prisma.content.update({
    where: { label },
    data: { text },
  });
};

export const saveContentImage = async (
  label: Label,
  file: File,
  title: string,
  isMain: boolean,
) => {
  const dir = getMiscellaneousDir();
  const fileInfo = await resizeAndSaveImage(file, title, dir);
  if (fileInfo) {
    await prisma.content.update({
      where: { label },
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
