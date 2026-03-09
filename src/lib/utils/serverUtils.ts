import { rmSync } from "fs";
import sharp from "sharp";
import { join } from "path";
import { transformValueToKey } from "@/lib/utils/commonUtils.ts";
import { IMAGE } from "@/constants/image.ts";
import { StructTheme, Type } from "@/lib/type.ts";
import { PresetColor, Theme } from "@@/prisma/generated/client";
import { getStructuredTheme, themeToHexa } from "@/lib/utils/themeUtils.ts";

const serverLibraryPath = process.env.PHOTOS_PATH;
const copyright = process.env.TITLE || "";

export const getDir = (type: Type) => {
  return join(`${serverLibraryPath}`, type);
};

export const getMiscellaneousDir = () => {
  return join(`${serverLibraryPath}`, "miscellaneous");
};

export const resizeAndSaveImage = async (
  file: File,
  title: string = "",
  dir: string,
  isMain: boolean = false,
) => {
  const titleString = transformValueToKey(title);
  const newFilename = `${titleString}-${Date.now()}.jpeg`;
  const bytes = await file.arrayBuffer();
  const imageBuffer = await sharp(Buffer.from(bytes))
    .jpeg({ quality: 100 })
    .toBuffer();

  const sharpStream = sharp({ failOn: "none" });
  const promises = [];

  promises.push(
    sharpStream
      .clone()
      .withMetadata({
        exif: {
          IFD0: {
            Copyright: copyright,
          },
        },
      })
      .toFile(`${dir}/${newFilename}`),
  );
  promises.push(
    sharpStream
      .clone()
      .resize({
        width: IMAGE.MD_PX,
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .withMetadata({
        exif: {
          IFD0: {
            Copyright: copyright,
          },
        },
      })
      .toFile(`${dir}/md/${newFilename}`),
  );
  promises.push(
    sharpStream
      .clone()
      .resize({
        width: IMAGE.SM_PX,
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .withMetadata({
        exif: {
          IFD0: {
            Copyright: copyright,
          },
        },
      })
      .toFile(`${dir}/sm/${newFilename}`),
  );

  sharp(imageBuffer).pipe(sharpStream);

  return Promise.all(promises)
    .then((res) => {
      const info = res[0];
      return {
        filename: newFilename,
        width: info.width,
        height: info.height,
        isMain,
      };
    })
    .catch((err) => {
      console.error(
        "Erreur à l'écriture des fichiers images, nettoyage...",
        err,
      );
      deleteFile(`${dir}/sm`, newFilename);
      deleteFile(`${dir}/md`, newFilename);
      deleteFile(dir, newFilename);
      return null;
    });
};

export const deleteFile = (dir: string, filename: string) => {
  rmSync(`${dir}/sm/${filename}`, { force: true });
  rmSync(`${dir}/md/${filename}`, { force: true });
  rmSync(`${dir}/${filename}`, { force: true });
};

export const getStructHexaTheme = (
  theme: Theme,
  presetColors: PresetColor[],
): StructTheme => getStructuredTheme(themeToHexa(theme, presetColors));
