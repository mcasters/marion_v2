"use server";

import {
  deleteFile,
  getMiscellaneousDir,
  resizeAndSaveImage,
} from "@/lib/utils/serverUtils";
import prisma from "@/lib/prisma.ts";
import { revalidatePath } from "next/cache";
import { ContentFull, Label } from "@/lib/type";
import { AdminRouteLabel, RouteLabel } from "@/constants/specific/routes.ts";
import { LABEL } from "@/constants/admin.ts";

export async function updateContent(
  formData: FormData,
): Promise<{ message: string; isError: boolean }> {
  const label = formData.get("label") as Label;
  const text = formData.get("text") as string;

  try {
    const content = await findOrCreateContent(label);
    await updateText(content.label, text);

    revalidatePath(`${RouteLabel[label]}`);
    return { message: "Contenu enregistré", isError: false };
  } catch (e) {
    return { message: "Erreur à l'enregistrement", isError: true };
  }
}

export async function updateImageContent(formData: FormData) {
  const label = formData.get("label") as Label;
  const bdContent = await findOrCreateContent(label);

  try {
    if (label === LABEL.SLIDER) await updateImageSlider(formData);
    else await updateImagePresentation(bdContent, formData);

    revalidatePath(`${RouteLabel[label]}`);
    revalidatePath(`${AdminRouteLabel[label]}`);
    return { message: "Images enregistrées", isError: false };
  } catch (e) {
    return { message: `Erreur à l'enregistrement`, isError: true };
  }
}

async function updateImageSlider(formData: FormData) {
  const files = formData.getAll("files") as File[];
  const filenamesToDelete = formData.get("filenamesToDelete") as string;

  let _filenamesToDelete: string[] = [];
  if (filenamesToDelete !== "")
    _filenamesToDelete = filenamesToDelete.split(",");

  for await (const file of files) {
    if (file.size > 0) {
      const isMain = formData.get("isMain") === "true";
      const title = isMain ? "mobileSlider" : "desktopSlider";
      await saveContentImage(LABEL.SLIDER, file, title, isMain);
    }
  }
  for await (const filename of _filenamesToDelete)
    await deleteImageContent(LABEL.SLIDER, filename);
}

async function updateImagePresentation(
  bdContent: ContentFull,
  formData: FormData,
) {
  const oldImage = bdContent.images[0];
  const files = formData.getAll("files") as File[];
  const filenamesToDelete = formData.get("filenamesToDelete") as string;

  if (files.length > 0 && files[0].size > 0) {
    if (oldImage)
      await deleteImageContent(LABEL.PRESENTATION, oldImage.filename);
    await saveContentImage(LABEL.PRESENTATION, files[0], "presentation", false);
  } else if (filenamesToDelete !== "")
    await deleteImageContent(LABEL.PRESENTATION, oldImage.filename);
}

const saveContentImage = async (
  label: Label,
  file: File,
  title: string,
  isMain: boolean,
) => {
  const fileInfo = await resizeAndSaveImage(file, title, getMiscellaneousDir());
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

const deleteImageContent = async (label: Label, filename: string) => {
  deleteFile(getMiscellaneousDir(), filename);
  await prisma.content.update({
    where: { label },
    data: {
      images: {
        delete: { filename: filename },
      },
    },
  });
};

const findOrCreateContent = async (label: Label): Promise<ContentFull> => {
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

const updateText = async (label: Label, text: string) => {
  await prisma.content.update({
    where: { label },
    data: { text },
  });
};
