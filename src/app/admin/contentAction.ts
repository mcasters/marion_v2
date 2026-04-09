"use server";

import { Image } from "@/lib/type.ts";
import { revalidatePath } from "next/cache";
import { AdminRouteLabel, RouteLabel } from "@/constants/specific/routes.ts";
import { db } from "@/db";
import { content, contentImage, LABEL } from "@/db/schema.ts";
import { eq } from "drizzle-orm";
import {
  deleteFile,
  getMiscellaneousDir,
  resizeAndSaveImage,
} from "@/lib/utils/serverUtils.ts";

export const getHomeText = async (): Promise<string | undefined> => {
  const content = await db.query.content.findFirst({
    columns: { text: true },
    where: { label: LABEL.INTRO },
  });
  return content?.text;
};

export const getHomeImages = async (): Promise<Image[]> => {
  const res = await db
    .select({
      filename: contentImage.filename,
      width: contentImage.width,
      height: contentImage.height,
      isMain: contentImage.isMain,
    })
    .from(content)
    .where(eq(content.label, LABEL.SLIDER))
    .innerJoin(contentImage, eq(contentImage.contentId, content.id));

  /*await db.query.content.findFirst({
    columns: { label: true },
    with: {
      images: {
        columns: {
          id: false,
          contentId: false,
        },
      },
    },
    where: { label: LABEL.SLIDER },
  });*/
  return res;
};

export const getContactContent = async (): Promise<
  Map<LABEL.ADDRESS | LABEL.PHONE | LABEL.EMAIL | LABEL.TEXT_CONTACT, string>
> => {
  const contents = await db.query.content.findMany({
    columns: { label: true, text: true },
    where: {
      label: {
        OR: [LABEL.ADDRESS, LABEL.PHONE, LABEL.EMAIL, LABEL.TEXT_CONTACT],
      },
    },
  });
  const map = new Map();
  contents.forEach((content) => map.set(content.label, content.text));
  return map;
};

export const getPresentationContent = async (): Promise<{
  text: Map<LABEL.PRESENTATION | LABEL.DEMARCHE | LABEL.INSPIRATION, string>;
  image: Image | null;
}> => {
  const contents = await db.query.content.findMany({
    columns: { label: true, text: true },
    with: {
      images: {
        columns: {
          id: false,
          contentId: false,
          isMain: false,
        },
      },
    },
    where: {
      label: { OR: [LABEL.PRESENTATION, LABEL.DEMARCHE, LABEL.INSPIRATION] },
    },
  });
  const map = new Map();
  let image: Image | null = null;
  contents.forEach((content) => {
    map.set(content.label, content.text);
    if (content.images.length) image = content.images[0];
  });
  return { text: map, image: image };
};

export async function updateContent(
  initialState: any,
  formData: FormData,
): Promise<{ message: string; isError: boolean }> {
  const label = formData.get("key") as LABEL;
  const text = formData.get("text") as string;

  try {
    await db.update(content).set({ text }).where(eq(content.label, label));

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
  const label = formData.get("key") as LABEL;

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

const updateImageSlider = async (formData: FormData) => {
  const filesToAdd = formData.getAll("filesToAdd") as File[];
  const filenamesToDelete = formData.get("filenamesToDelete") as string;

  if (filesToAdd.length > 0) {
    const isMain = formData.get("isMain") === "true";
    const title = isMain ? "mobileSlider" : "desktopSlider";
    await saveContentImage(LABEL.SLIDER, filesToAdd, title, isMain);
  }

  if (filenamesToDelete !== "")
    for await (const filename of filenamesToDelete.split(",")) {
      await deleteImageContent(filename);
    }
};

const updateImagePresentation = async (formData: FormData) => {
  const filesToAdd = formData.getAll("filesToAdd") as File[];
  const filenamesToDelete = formData.get("filenamesToDelete") as string;

  if (filesToAdd.length > 0)
    await saveContentImage(
      LABEL.PRESENTATION,
      filesToAdd,
      "presentation",
      false,
    );

  if (filenamesToDelete !== "") await deleteImageContent(filenamesToDelete);
};

const saveContentImage = async (
  label: LABEL,
  filesToAdd: File[],
  title: string,
  isMain: boolean,
) => {
  let contentToUpdateId = (
    await db.query.content.findFirst({ where: { label } })
  )?.id;

  if (!contentToUpdateId) {
    const newContent = await db
      .insert(content)
      .values({
        label,
        text: "",
        title: "",
      })
      .$returningId();
    contentToUpdateId = newContent[0].id;
  }

  for await (const file of filesToAdd) {
    if (file.size > 0) {
      const fileInfo = await resizeAndSaveImage(
        file,
        title,
        getMiscellaneousDir(),
      );
      if (fileInfo)
        await db.insert(contentImage).values({
          filename: fileInfo.filename,
          width: fileInfo.width,
          height: fileInfo.height,
          isMain,
          contentId: contentToUpdateId,
        });
    }
  }
};

const deleteImageContent = async (filename: string) => {
  deleteFile(getMiscellaneousDir(), filename);
  await db.delete(contentImage).where(eq(contentImage.filename, filename));
};
