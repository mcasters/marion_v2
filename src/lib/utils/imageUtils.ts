import { Content, EnhancedImage, Image, Post, Work } from "@/lib/type.ts";
import { FILE_TYPES } from "@/constants/image.ts";
import { getSliders } from "@/lib/utils/commonUtils.ts";
import { MESSAGE } from "@/constants/admin.ts";
import Resizer from "react-image-file-resizer";
import { TYPE } from "@/db/schema.ts";

export const getSliderLandscapeImages = (contents: Content[]): Image[] => {
  const images: Image[] = getSliders(contents);
  return images.filter((i) => !i.isMain);
};

export const getSliderPortraitImages = (contents: Content[]): Image[] => {
  const images: Image[] = getSliders(contents);
  return images.filter((i) => i.isMain);
};

export const getEnhancedImages = (
  items: Work[] | Post[],
  isSmall: boolean,
  owner: string = "",
): EnhancedImage[] => {
  const tab: EnhancedImage[] = [];
  items.forEach((item) => {
    item.images.forEach((image) => {
      let obj = {
        littleScr: `/images/${item.type}/${isSmall ? "sms/" : "md/"}${image.filename}`,
        src: `/images/${item.type}/${isSmall ? "mds/" : ""}${image.filename}`,
        width: image.width,
        height: image.height,
        alt:
          item.type === TYPE.POST
            ? `Photo du post "${item.title}" de ${owner}`
            : `${item.title} - ${item.type} de ${owner}`,
      };
      tab.push(
        item.type === TYPE.POST
          ? {
              ...obj,
              title: item.title,
              year: new Date(item.date).getFullYear(),
            }
          : { ...obj, work: item },
      );
    });
  });
  return tab;
};

export const validateFile = async (
  file: File,
  increaseWeight: (arg0: number) => number,
  acceptSmallImage: boolean,
): Promise<{ message: string; isError: boolean }> => {
  if (!FILE_TYPES.includes(file.type))
    return { message: MESSAGE.error_imageType, isError: true };

  const weight = increaseWeight(file.size);
  if (weight > 30000000) {
    return { message: MESSAGE.error_sizeUpload, isError: true };
  }

  if (!acceptSmallImage) {
    const bmp = await createImageBitmap(file);
    if (bmp.width < 2000) {
      bmp.close();
      return { message: MESSAGE.error_imageSize, isError: true };
    }
    bmp.close();
  }
  return { message: "OK", isError: false };
};

const resizeFile = (file: File, quality: number) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      2000,
      2000,
      "JPEG",
      quality,
      0,
      (file) => {
        resolve(file);
      },
      "file",
    );
  });
export const constraintImage = async (
  file: File,
  quality = 90,
  drop = 10,
): Promise<File> => {
  const done = (await resizeFile(file, quality)) as File;

  if (done.size > 200000 && quality - drop > 10) {
    return constraintImage(file, quality - drop);
  }
  return done;
};
