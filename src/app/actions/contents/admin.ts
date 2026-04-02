"use server";

import {
  deleteFile,
  getMiscellaneousDir,
  resizeAndSaveImage,
} from "@/lib/utils/serverUtils";
import prisma from "@/lib/prisma.ts";
import { revalidatePath } from "next/cache";
import { KeyContent } from "@/lib/type";
import { AdminRouteLabel, RouteLabel } from "@/constants/specific/routes.ts";
import { LABEL } from "@/db/schema.ts";

export async function updateContent(
  initialState: any,
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
    return { message: "Enregistré", isError: false };
  } catch (e) {
    return { message: "Erreur à l'enregistrement", isError: true };
  }
}

export async function updateImageContent(
  initialState: any,
  formData: FormData,
) {
  const label = formData.get("key") as KeyContent;

  try {
    if (label === LABEL.SLIDER) await updateImageSlider(formData);
    else {
      await updateImagePresentation(formData);
    }

    revalidatePath(`${RouteLabel[label]}`);
    revalidatePath(`${AdminRouteLabel[label]}`);
    return { message: "Enregistré", isError: false };
  } catch (e) {
    return { message: `Erreur à l'enregistrement`, isError: true };
  }
}

async function updateImageSlider(formData: FormData) {
  const filesToAdd = formData.getAll("filesToAdd") as File[];
  const filenamesToDelete = formData.get("filenamesToDelete") as string;

  if (filesToAdd.length > 0) {
    const isMain = formData.get("isMain") === "true";
    const title = isMain ? "mobileSlider" : "desktopSlider";
    await saveContentImage(LABEL.SLIDER, filesToAdd, title, isMain);
  }

  if (filenamesToDelete !== "")
    for await (const filename of filenamesToDelete.split(",")) {
      await deleteImageContent(LABEL.SLIDER, filename);
    }
}

async function updateImagePresentation(formData: FormData) {
  const filesToAdd = formData.getAll("filesToAdd") as File[];
  const filenamesToDelete = formData.get("filenamesToDelete") as string;

  if (filenamesToDelete !== "")
    await deleteImageContent(LABEL.PRESENTATION, filenamesToDelete);

  if (filesToAdd.length > 0)
    await saveContentImage(
      LABEL.PRESENTATION,
      filesToAdd,
      "presentation",
      false,
    );
}

const saveContentImage = async (
  label: KeyContent,
  filesToAdd: File[],
  title: string,
  isMain: boolean,
) => {
  for await (const file of filesToAdd) {
    if (file.size > 0) {
      const fileInfo = await resizeAndSaveImage(
        file,
        title,
        getMiscellaneousDir(),
      );
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
    }
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
