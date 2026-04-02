"use server";

import { FileInfo } from "@/lib/type.ts";
import {
  deleteFile,
  getDir,
  resizeAndSaveImage,
} from "@/lib/utils/serverUtils.ts";
import { db } from "@/db";
import {
  categoryContent,
  postImage,
  sculptureImage,
  TYPE,
} from "@/db/schema.ts";
import { eq } from "drizzle-orm";

export const handleAddAndRemoveFiles = async (
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING | TYPE.POST,
  formData: FormData,
): Promise<FileInfo[] | null> => {
  let filenamesToDelete: string[] = [];
  const mainToDelete = formData.get("mainFilenameToDelete") as string;
  const toDelete = formData.get("filenamesToDelete") as string;
  filenamesToDelete = filenamesToDelete
    .concat(mainToDelete.split(","))
    .concat(toDelete.split(","));
  await handleRemoveFiles(type, filenamesToDelete);

  const fileInfos: FileInfo[] = [];
  const dir = getDir(type);
  const title = formData.get("title") as string;
  const mainFileToAdd = formData.get("mainFileToAdd") as File;
  const filesToAdd = formData.getAll("filesToAdd") as File[];

  if (type === TYPE.POST && mainFileToAdd.size > 0)
    fileInfos.push(
      <FileInfo>await resizeAndSaveImage(mainFileToAdd, title, dir, true),
    );

  if (filesToAdd.length) {
    for await (const file of filesToAdd) {
      if (file.size > 0)
        fileInfos.push(
          <FileInfo>await resizeAndSaveImage(file, title, dir, false),
        );
    }
  }
  return fileInfos.length > 0 ? fileInfos : null;
};

export const handleRemoveFiles = async (
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING | TYPE.POST,
  filenamesToDelete: string[],
) => {
  for await (const filename of filenamesToDelete) {
    if (filename !== "") {
      deleteFile(getDir(type), filename);

      if (type === TYPE.POST) {
        await db.delete(postImage).where(eq(postImage.filename, filename));
      } else {
        await handleImagesInCategory(filename);
        if (type === TYPE.SCULPTURE) {
          await db
            .delete(sculptureImage)
            .where(eq(sculptureImage.filename, filename));
        }
      }
    }
  }
};

export const handleImagesInCategory = async (filename: string) => {
  await db
    .update(categoryContent)
    .set({
      imageFilename: "",
      imageWidth: 0,
      imageHeight: 0,
    })
    .where(eq(categoryContent.imageFilename, filename));
};
