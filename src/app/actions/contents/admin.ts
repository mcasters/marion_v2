"use server";

import { deleteFile, getMiscellaneousDir } from "@/lib/utils/serverUtils";
import prisma from "@/lib/prisma.ts";
import { revalidatePath } from "next/cache";
import {
  findOrCreateContent,
  saveContentImage,
  updateText,
} from "@/app/actions/contents/queries";
import { ContentFull, Label } from "@/lib/type";
import { AdminRouteLabel, RouteLabel } from "@/constants/specific/routes.ts";

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
    if (label === Label.SLIDER) await updateImageSlider(formData);
    else await updateImagePresentation(bdContent, formData);

    revalidatePath(`${RouteLabel[label]}`);
    revalidatePath(`${AdminRouteLabel[label]}`);
    return { message: "Images enregistrées", isError: false };
  } catch (e) {
    return { message: "Erreur à l'enregistrement", isError: true };
  }
}

export async function deleteImageContent(filename: string) {
  const dir = getMiscellaneousDir();

  try {
    if (filename) {
      const content = await prisma.content.findFirst({
        where: {
          images: {
            some: {
              filename,
            },
          },
        },
      });

      if (content) {
        deleteFile(dir, filename);
        await prisma.content.update({
          where: { id: content.id },
          data: {
            images: {
              delete: { filename },
            },
          },
        });
      }
    }

    let path, adminPath;
    if (filename.startsWith("presentation")) {
      adminPath = "/admin/presentation";
      path = "/presentation";
    } else {
      adminPath = "/admin/home";
      path = "/home";
    }
    revalidatePath(adminPath);
    revalidatePath(path);
    return { message: "Image supprimée", isError: false };
  } catch (e) {
    return { message: "Erreur à la suppression", isError: true };
  }
}

async function updateImageSlider(formData: FormData) {
  const files = formData.getAll("files") as File[];

  for (const file of files) {
    if (file.size > 0) {
      const isMain = formData.get("isMain") === "true";
      const title = isMain ? "mobileSlider" : "desktopSlider";
      await saveContentImage(Label.SLIDER, file, title, isMain);
    }
  }
}

async function updateImagePresentation(
  bdContent: ContentFull,
  formData: FormData,
) {
  const image = bdContent.images[0];
  const files = formData.getAll("files") as File[];

  if (files.length > 0 && files[0].size > 0) {
    if (image) {
      const oldFilename = image.filename;
      deleteFile(getMiscellaneousDir(), oldFilename);
      await prisma.content.update({
        where: { label: Label.PRESENTATION },
        data: {
          images: {
            delete: { filename: oldFilename },
          },
        },
      });
    }
    await saveContentImage(Label.PRESENTATION, files[0], "presentation", false);
  }
}
