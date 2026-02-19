import {
  ContentFull,
  Image,
  PhotoTab,
  PhotoTabEnhanced,
  Post,
  Type,
  Work,
} from "@/lib/type.ts";
import { IMAGE } from "@/constants/image.ts";
import { getSliderContent, getSliders } from "@/lib/utils/commonUtils.ts";

const getEmptyPhotoTab = (): PhotoTab => {
  return { sm: [], md: [], lg: [] };
};

const getEmptyPhotoTabEnhanced = (): PhotoTabEnhanced => {
  return { sm: [], md: [], lg: [] };
};

const getSMData = (folder: string, image: Image) => {
  const isUnderSM = image.width < IMAGE.SM_PX;
  return {
    src: `/images/${folder}/sm/${image.filename}`,
    width: isUnderSM ? image.width : IMAGE.SM_PX,
    height: isUnderSM
      ? image.height
      : (image.height * IMAGE.SM_PX) / image.width,
  };
};

const getMDData = (folder: string, image: Image) => {
  const isUnderMD = image.width < IMAGE.MD_PX;
  return {
    src: `/images/${folder}/md/${image.filename}`,
    width: isUnderMD ? image.width : IMAGE.MD_PX,
    height: isUnderMD
      ? image.height
      : (image.height * IMAGE.MD_PX) / image.width,
  };
};

const getLGData = (folder: string, image: Image) => {
  return {
    src: `/images/${folder}/${image.filename}`,
    width: image.width,
    height: image.height,
  };
};

const getSplitMainPhotosFromImages = (
  images: Image[],
  folder: string,
  alt: string,
  title: string = "",
  date: Date = new Date(),
): { mainPhotos: PhotoTab; photos: PhotoTab } => {
  const mainPhotos = getEmptyPhotoTab();
  const photos = getEmptyPhotoTab();

  for (const image of images) {
    const rest = {
      isMain: image.isMain,
      title,
      date,
      alt,
    };
    const photosSM = {
      ...getSMData(folder, image),
      ...rest,
    };
    const photosMD = {
      ...getMDData(folder, image),
      ...rest,
    };
    const photosLG = {
      ...getLGData(folder, image),
      ...rest,
    };

    if (image.isMain) {
      mainPhotos.sm.push(photosSM);
      mainPhotos.md.push(photosMD);
      mainPhotos.lg.push(photosLG);
    } else {
      photos.sm.push(photosSM);
      photos.md.push(photosMD);
      photos.lg.push(photosLG);
    }
  }
  return { mainPhotos, photos };
};

const getPhotosEnhancedFromImages = (
  item: Work,
  alt: string,
  photos: PhotoTabEnhanced,
): PhotoTabEnhanced => {
  const folder =
    item.type === Type.PAINTING
      ? "peinture"
      : item.type === Type.SCULPTURE
        ? "sculpture"
        : "dessin";

  for (const image of item.images) {
    const rest = {
      isMain: true,
      title: item.title,
      date: item.date,
      alt,
      item,
    };
    photos.sm.push({
      ...getSMData(folder, image),
      ...rest,
    });
    photos.md.push({
      ...getMDData(folder, image),
      ...rest,
    });
    photos.lg.push({
      ...getLGData(folder, image),
      ...rest,
    });
  }
  return photos;
};

export const getPhotoTabFromImages = (
  images: Image[],
  folder: string,
  alt: string,
  title: string = "",
  date: Date = new Date(),
): PhotoTab => {
  const photos = getEmptyPhotoTab();

  for (const image of images) {
    const rest = {
      isMain: image.isMain,
      title,
      date,
      alt,
    };
    photos.sm.push({
      ...getSMData(folder, image),
      ...rest,
    });
    photos.md.push({
      ...getMDData(folder, image),
      ...rest,
    });
    photos.lg.push({
      ...getLGData(folder, image),
      ...rest,
    });
  }
  return photos;
};

export const getSliderPhotoTab = (
  contents: ContentFull[],
): { mainPhotos: PhotoTab; photos: PhotoTab } => {
  const content = getSliderContent(contents);
  if (content) {
    return getSplitMainPhotosFromImages(
      content.images,
      "miscellaneous",
      `Œuvre de ${process.env.TITLE}`,
    );
  }
  return { mainPhotos: getEmptyPhotoTab(), photos: getEmptyPhotoTab() };
};

export const getPostPhotoTab = (
  post: Post,
  alt: string,
): { mainPhotos: PhotoTab; photos: PhotoTab } => {
  const folder = "post";
  return getSplitMainPhotosFromImages(
    post.images,
    folder,
    alt,
    post.title,
    post.date,
  );
};

export const getItemPhotoTab = (item: Work, alt: string): PhotoTab => {
  const folder =
    item.type === Type.PAINTING
      ? "peinture"
      : item.type === Type.SCULPTURE
        ? "sculpture"
        : "dessin";
  return getPhotoTabFromImages(item.images, folder, alt, item.title, item.date);
};

export const getItemsPhotoTabEnhanced = (
  items: Work[],
  alt: string,
): PhotoTabEnhanced => {
  let photosEnhanced = getEmptyPhotoTabEnhanced();
  items.forEach((item) => {
    photosEnhanced = getPhotosEnhancedFromImages(item, alt, photosEnhanced);
  });
  return photosEnhanced;
};

export const getSliderLandscapeImages = (contents: ContentFull[]): Image[] => {
  const images: Image[] = getSliders(contents);
  return images.filter((i) => !i.isMain);
};

export const getSliderPortraitImages = (contents: ContentFull[]): Image[] => {
  const images: Image[] = getSliders(contents);
  return images.filter((i) => i.isMain);
};
