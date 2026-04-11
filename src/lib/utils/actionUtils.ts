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
  DbDrawing,
  DbPainting,
  DbPost,
  DbPostImage,
  DbSculpture,
  DbSculptureImage,
  FileInfo,
  Post,
  Work,
  WorkImage,
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
export const createWorkObject = (data: DbPainting | DbDrawing): Work => {
  const { imageFilename, imageHeight, imageWidth, ...rest } = data;
  return {
    ...rest,
    length: 0,
    images: [
      { filename: imageFilename, width: imageWidth, height: imageHeight },
    ],
  };
};

export const aggregateSculptureRows = (
  rows: { sculpture: DbSculpture; sculptureImage: DbSculptureImage }[],
): Record<number, { sculpture: DbSculpture; images: DbSculptureImage[] }> => {
  return rows.reduce<
    Record<number, { sculpture: DbSculpture; images: DbSculptureImage[] }>
  >((acc, row) => {
    const sculpture = row.sculpture;
    const image = row.sculptureImage;

    if (!acc[sculpture.id]) {
      acc[sculpture.id] = { sculpture: sculpture, images: [] };
    }
    if (image) {
      acc[sculpture.id].images.push(image);
    }
    return acc;
  }, {});
};

export const createSculptureWorkObject = (
  dbSculptures: Record<
    number,
    { sculpture: DbSculpture; images: DbSculptureImage[] }
  >,
): Work[] => {
  const works: Work[] = [];
  Object.entries(dbSculptures).forEach(([n, data]) => {
    const { createdAt, ...rest } = data.sculpture;
    const images: WorkImage[] = [];
    data.images.forEach((image) => {
      const { id, isMain, sculptureId, ...restImage } = image;
      images.push({ ...restImage });
    });
    works.push({ ...rest, images });
  });
  return works;
};

export const aggregatePostRows = (
  rows: { post: DbPost; postImage: DbPostImage }[],
): Record<number, { post: DbPost; images: DbPostImage[] }> => {
  return rows.reduce<Record<number, { post: DbPost; images: DbPostImage[] }>>(
    (acc, row) => {
      const post = row.post;
      const image = row.postImage;

      if (!acc[post.id]) {
        acc[post.id] = { post: post, images: [] };
      }
      if (image) {
        acc[post.id].images.push(image);
      }
      return acc;
    },
    {},
  );
};

export const createPostObject = (
  dbPost: Record<number, { post: DbPost; images: DbPostImage[] }>,
): Post[] => {
  const posts: Post[] = [];
  Object.entries(dbPost).forEach(([n, data]) => {
    const { createdAt, published, viewCount, ...rest } = data.post;
    const images: WorkImage[] = [];
    data.images.forEach((image) => {
      const { id, postId, ...restImage } = image;
      images.push({ ...restImage });
    });
    posts.push({ ...rest, images });
  });
  return posts;
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
      filenames: [],
      count: 0,
    });
  });
  categoryMap.set(0, {
    ...getNoCategory(type),
    filenames: [],
    count: 0,
  });
  items.forEach((item) => {
    const itemCategoryId = item.categoryId === null ? 0 : item.categoryId;
    const category = categoryMap.get(itemCategoryId);
    category.count += 1;
    item.images.forEach((image) => {
      category.filenames = category.filenames.concat(image.filename);
    });
    categoryMap.set(itemCategoryId, category);
  });
  if (categoryMap.get(0).count === 0) categoryMap.delete(0);
  return [...categoryMap.values()];
};
