"use server";

import { FileInfo } from "@/lib/type.ts";
import {
  deleteFile,
  getDir,
  resizeAndSaveImage,
} from "@/lib/utils/serverUtils.ts";
import { TYPE } from "@/db/schema.ts";

export const handleAddFiles = async (
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING | TYPE.POST,
  formData: FormData,
): Promise<FileInfo[] | null> => {
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
  formData?: FormData,
  filenamesToDelete?: string[],
): Promise<string[] | null> => {
  let _filenamesToDelete: string[] = filenamesToDelete ?? [];

  if (formData) {
    const mainToDelete = formData.get("mainFilenameToDelete") as string;
    const toDelete = formData.get("filenamesToDelete") as string;

    if (mainToDelete) _filenamesToDelete.push(...mainToDelete.split(","));
    if (toDelete) _filenamesToDelete.push(...toDelete.split(","));
  }

  let filenamesDeleted: string[] = [];
  for (const filename of _filenamesToDelete) {
    if (filename !== "") {
      deleteFile(getDir(type), filename);
      filenamesDeleted.push(filename);
    }
  }
  return filenamesDeleted.length > 0 ? filenamesDeleted : null;
};
