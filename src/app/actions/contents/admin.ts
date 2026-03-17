"use server";

import {
  deleteFile,
  getMiscellaneousDir,
  resizeAndSaveImage,
} from "@/lib/utils/serverUtils";
import prisma from "@/lib/prisma.ts";
import { revalidatePath } from "next/cache";
import { ContentFull, KeyContent } from "@/lib/type";
import { AdminRouteLabel, RouteLabel } from "@/constants/specific/routes.ts";
import { KEY_LABEL } from "@/constants/admin.ts";

export async function updateContent(
  formData: FormData,
): Promise<{ message: string; isError: boolean }> {
  const label = formData.get("key") as KeyContent;
  const text = formData.get("text") as string;

  try {
    await prisma.content.update({
      where: { label },
      data: { text },
    });

    revalidatePath(`${RouteLabel[label]}`);
    return { message: "Contenu enregistré", isError: false };
  } catch (e) {
    return { message: "Erreur à l'enregistrement", isError: true };
  }
}

export async function updateImageContent(formData: FormData) {
  const label = formData.get("key") as KeyContent;

  try {
    if (label === KEY_LABEL.SLIDER) await updateImageSlider(formData);
    else {
      const bdContent = await findOrCreateContent(label);
      await updateImagePresentation(bdContent, formData);
    }

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
      await saveContentImage(KEY_LABEL.SLIDER, file, title, isMain);
    }
  }
  for await (const filename of _filenamesToDelete)
    await deleteImageContent(KEY_LABEL.SLIDER, filename);
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
      await deleteImageContent(KEY_LABEL.PRESENTATION, oldImage.filename);
    await saveContentImage(
      KEY_LABEL.PRESENTATION,
      files[0],
      "presentation",
      false,
    );
  } else if (filenamesToDelete !== "")
    await deleteImageContent(KEY_LABEL.PRESENTATION, oldImage.filename);
}

const saveContentImage = async (
  label: KeyContent,
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

const deleteImageContent = async (label: KeyContent, filename: string) => {
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

const findOrCreateContent = async (label: KeyContent): Promise<ContentFull> => {
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
