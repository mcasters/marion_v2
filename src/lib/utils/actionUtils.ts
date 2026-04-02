import {
  createPainting,
  createPaintingCategory,
  deletePainting,
  deletePaintingCategory,
  updatePainting,
  updatePaintingCategory,
} from "@/app/admin/peintures/action.ts";
import {
  createSculpture,
  createSculptureCategory,
  deleteSculpture,
  deleteSculptureCategory,
  updateSculpture,
  updateSculptureCategory,
} from "@/app/admin/sculptures/action.ts";
import {
  createDrawing,
  createDrawingCategory,
  deleteDrawing,
  deleteDrawingCategory,
  updateDrawing,
  updateDrawingCategory,
} from "@/app/admin/dessins/action.ts";
import {
  createPost,
  deletePost,
  updatePost,
} from "@/app/admin/posts/action.ts";
import { TYPE } from "@/db/schema.ts";
import {
  AdminCategory,
  Category,
  Drawing,
  FileInfo,
  Painting,
  Work,
} from "@/lib/type.ts";
import { getNoCategory, transformValueToKey } from "@/lib/utils/commonUtils.ts";

export const getCreateAction = (
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING | TYPE.POST,
) => {
  switch (type) {
    case TYPE.PAINTING:
      return createPainting;
    case TYPE.SCULPTURE:
      return createSculpture;
    case TYPE.DRAWING:
      return createDrawing;
    case TYPE.POST:
      return createPost;
  }
};

export const getUpdateAction = (
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING | TYPE.POST,
) => {
  switch (type) {
    case TYPE.PAINTING:
      return updatePainting;
    case TYPE.SCULPTURE:
      return updateSculpture;
    case TYPE.DRAWING:
      return updateDrawing;
    case TYPE.POST:
      return updatePost;
  }
};

export const getDeleteAction = (
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING | TYPE.POST,
) => {
  switch (type) {
    case TYPE.PAINTING:
      return deletePainting;
    case TYPE.SCULPTURE:
      return deleteSculpture;
    case TYPE.DRAWING:
      return deleteDrawing;
    case TYPE.POST:
      return deletePost;
  }
};

export const getCreateCategoryAction = (
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING,
) => {
  switch (type) {
    case TYPE.PAINTING:
      return createPaintingCategory;
    case TYPE.SCULPTURE:
      return createSculptureCategory;
    case TYPE.DRAWING:
      return createDrawingCategory;
  }
};

export const getUpdateCategoryAction = (
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING,
) => {
  switch (type) {
    case TYPE.PAINTING:
      return updatePaintingCategory;
    case TYPE.SCULPTURE:
      return updateSculptureCategory;
    case TYPE.DRAWING:
      return updateDrawingCategory;
  }
};

export const getDeleteCategoryAction = (
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING,
) => {
  switch (type) {
    case TYPE.PAINTING:
      return deletePaintingCategory;
    case TYPE.SCULPTURE:
      return deleteSculptureCategory;
    case TYPE.DRAWING:
      return deleteDrawingCategory;
  }
};
export const createPaintingData = (
  formData: FormData,
  fileInfos: FileInfo[] | null,
) => getCommonData(formData, fileInfos);
export const createDrawingData = (
  formData: FormData,
  fileInfos: FileInfo[] | null,
) => getCommonData(formData, fileInfos);
export const createSculptureData = (formData: FormData) => {
  const rawFormData = Object.fromEntries(formData);
  const common = getCommonData(formData, null);
  return {
    ...common,
    length: Number(rawFormData.length as string),
  };
};
const getCommonData = (formData: FormData, fileInfos: FileInfo[] | null) => {
  const rawFormData = Object.fromEntries(formData);
  const categoryId = Number(rawFormData.categoryId as string);
  const price = rawFormData.price as string;

  const file = fileInfos
    ? {
        imageFilename: fileInfos[0].filename,
        imageHeight: fileInfos[0].height,
        imageWidth: fileInfos[0].width,
      }
    : {};
  return {
    title: rawFormData.title as string,
    date: new Date(rawFormData.date as string),
    technique: rawFormData.technique as string,
    description: rawFormData.description as string,
    height: Number(rawFormData.height as string),
    width: Number(rawFormData.width as string),
    categoryId: categoryId === 0 ? null : categoryId,
    isToSell: rawFormData.isToSell === "on",
    price: price ? Number(price) : null,
    sold: rawFormData.sold === "on",
    isOut: rawFormData.isOut === "on",
    outInformation: rawFormData.outInformation as string,
    ...file,
  };
};
export const createPostData = (formData: FormData) => {
  const rawFormData = Object.fromEntries(formData);
  return {
    title: rawFormData.title as string,
    date: new Date(rawFormData.date as string),
    text: rawFormData.text as string,
  };
};
export const createCategoryData = (formData: FormData) => {
  const rawFormData = Object.fromEntries(formData);
  const value = rawFormData.value as string;

  return {
    key: transformValueToKey(value),
    value,
    title: rawFormData.title as string,
    text: rawFormData.text as string,
    imageFilename: rawFormData.filename as string,
  };
};
export const createWorkObject = (
  data: Painting | Drawing,
  type: TYPE.PAINTING | TYPE.DRAWING,
): Work => {
  return {
    id: data.id,
    type,
    title: data.title,
    date: new Date(data.date),
    technique: data.technique,
    description: data.description,
    height: data.height,
    width: data.width,
    length: 0,
    isToSell: data.isToSell,
    price: data.price,
    sold: data.sold,
    isOut: data.isOut,
    outInformation: data.outInformation,
    categoryId: data.categoryId,
    images: [
      {
        id: 0,
        filename: data.imageFilename,
        width: data.imageWidth,
        height: data.imageHeight,
        isMain: true,
      },
    ],
  };
};
export const createAdminCategoryObjects = (
  categories: Category[],
  items: Work[],
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING,
): AdminCategory[] => {
  const categoryMap = new Map();
  categories.forEach((category) => {
    categoryMap.set(category.id, {
      ...category,
      images: [],
      count: 0,
    });
  });
  categoryMap.set(0, {
    ...getNoCategory(type),
    images: [],
    count: 0,
  });
  items.forEach((item) => {
    const categoryId = item.categoryId === null ? 0 : item.categoryId;
    const category = categoryMap.get(categoryId);
    category.count += 1;
    category.images = category.images.concat(item.images);
    categoryMap.set(categoryId, category);
  });
  if (categoryMap.get(0).count === 0) categoryMap.delete(0);
  return [...categoryMap.values()];
};
