import { Meta } from "@@/prisma/generated/client";
import { Label } from "@@/prisma/generated/enums";
import {
  Category,
  CategoryContent,
  CategoryFull,
  ContentFull,
  DragListElement,
  Filter,
  HomeLayout,
  Image,
  Item,
  ItemDarkBackground,
  Layout,
  Message,
  Post,
  Type,
  Work,
} from "@/lib/type.ts";
import { META } from "@/constants/admin.ts";

export const transformValueToKey = (value: string): string =>
  value
    .toLowerCase()
    .split(" ")
    .join("_")
    .replace(/[`~!@#$%^&*()'”‘|+\-=?;:",.<>{}\[\]\\\/]/gi, "")
    .replace(/à/gi, "a")
    .replace(/é/gi, "e")
    .replace(/è/gi, "e")
    .replace(/ê/gi, "e")
    .replace(/ù/gi, "u")
    .replace(/ç/gi, "c")
    .replace(/î/gi, "i")
    .replace(/ë/gi, "e");

// @ts-expect-error: any return function
export const createNestedObject = (obj, key, ...keys) => {
  return key != undefined
    ? // @ts-expect-error: A spread argument must either have a tuple type or be passed to a rest parameter.
      createNestedObject(obj[key] || (obj[key] = {}), ...keys)
    : obj;
};

export const getSliderContent = (contents: ContentFull[]): ContentFull | null =>
  contents?.filter((c) => c.label === Label.SLIDER)[0] || null;

export const getPresentation = (contents: ContentFull[]): string =>
  contents?.filter((c) => c.label === Label.PRESENTATION)[0]?.text || "";

export const getPresentationImage = (contents: ContentFull[]): Image[] =>
  contents?.filter((c) => c.label === Label.PRESENTATION)[0]?.images || [];

export const getDemarche = (contents: ContentFull[]): string =>
  contents?.filter((c) => c.label === Label.DEMARCHE)[0]?.text || "";

export const getInspiration = (contents: ContentFull[]): string =>
  contents?.filter((c) => c.label === Label.INSPIRATION)[0]?.text || "";

export const getIntroText = (contents: ContentFull[]): string =>
  contents?.filter((c) => c.label === Label.INTRO)[0]?.text || "";

export const getSliders = (contents: ContentFull[]): Image[] | [] =>
  contents?.filter((c) => c.label === Label.SLIDER)[0]?.images || [];

export const getAddress = (contents: ContentFull[]): string =>
  contents?.filter((c) => c.label === Label.ADDRESS)[0]?.text || "";

export const getPhone = (contents: ContentFull[]): string =>
  contents?.filter((c) => c.label === Label.PHONE)[0]?.text || "";

export const getEmail = (contents: ContentFull[]): string =>
  contents?.filter((c) => c.label === Label.EMAIL)[0]?.text || "";

export const getContactText = (contents: ContentFull[]): string =>
  contents?.filter((c) => c.label === Label.TEXT_CONTACT)[0]?.text || "";

export const getMetaMap = (metas: Meta[]): Map<string, string> => {
  const map = new Map();
  metas.forEach((meta) => {
    map.set(meta.label, meta.text);
  });
  return map;
};

export const getImageSrc = (item: Item) => {
  if (item.id === 0) return "";
  let src;
  if (item.type === Type.CATEGORY) {
    src =
      item.content.image.filename !== ""
        ? `/images/${item.workType}/sm/${item.content.image.filename}`
        : "";
  } else if (item.type === Type.POST) {
    let image = item.images.filter((i: Image) => i.isMain)[0];
    if (!image) {
      image = item.images[0];
    }
    src = image ? `/images/post/${image.filename}` : "";
  } else {
    src = `/images/${item.type}/${item.images[0].filename}`;
  }

  return src;
};

export const getEmptyWork = (
  type: Type.SCULPTURE | Type.DRAWING | Type.PAINTING,
): Work => {
  return {
    id: 0,
    type,
    title: "",
    date: new Date(),
    technique: "",
    description: "",
    height: 0,
    width: 0,
    length: 0,
    isToSell: false,
    price: undefined,
    sold: false,
    images: [],
    categoryId: null,
  };
};

export const getEmptyPost = (): Post => {
  return {
    id: 0,
    type: Type.POST,
    title: "",
    date: new Date(),
    text: "",
    images: [],
  };
};

export const getEmptyImage = (): Image => {
  return {
    id: 0,
    filename: "",
    width: 0,
    height: 0,
    isMain: false,
  };
};

export const getEmptyCategoryContent = (): CategoryContent => {
  return {
    id: 0,
    title: "",
    text: "",
    image: getEmptyImage(),
  };
};

export const getEmptyCategoryFull = (
  workType: Type.PAINTING | Type.DRAWING | Type.SCULPTURE,
): CategoryFull => {
  return {
    id: 0,
    key: "",
    value: "",
    type: Type.CATEGORY,
    count: 0,
    workType,
    content: getEmptyCategoryContent(),
    images: [getEmptyImage()],
  };
};

export const getNoCategory = (): Category => {
  return {
    id: 0,
    key: "no-category",
    value: "Sans catégorie",
    content: getEmptyCategoryContent(),
  };
};

export const getEmptyMessage = (): Message => {
  return {
    id: 0,
    date: new Date(),
    dateUpdated: null,
    text: "",
    author: {
      id: 0,
      email: "",
      password: "",
      isAdmin: false,
    },
  };
};

export const getWorkLayout = (
  metas: Map<string, string>,
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
): [Layout, ItemDarkBackground] => {
  const metaLayout =
    type === Type.PAINTING
      ? metas.get(META.PAINTING_LAYOUT) || "1,1"
      : type === Type.SCULPTURE
        ? metas.get(META.SCULPTURE_LAYOUT) || "3,1"
        : metas.get(META.DRAWING_LAYOUT) || "1,1";

  const strings = metaLayout.split(",");
  return [parseInt(strings[0]), parseInt(strings[1])];
};

export const getHomeLayout = (metas: Map<string, string>): HomeLayout => {
  return parseInt(metas.get(META.HOME_LAYOUT) || "0");
};

export const getCategoriesFull = (
  categories: Category[],
  items: Work[],
): CategoryFull[] => {
  const map = new Map();
  categories.forEach((category) => {
    map.set(category.id, {
      ...category,
      type: "catégorie",
      workType: items[0].type,
      images: [],
      count: 0,
    });
  });
  items.forEach((item) => {
    if (item.id === 0) return [...map.values()];
    const categoryMap =
      item.categoryId === null ? map.get(0) : map.get(item.categoryId);
    categoryMap.images.push(...item.images);
    categoryMap.count += 1;
  });
  return [...map.values()];
};

export const getYearsFromWorks = (items: Work[]): number[] => {
  const years: number[] = [];
  items.forEach((item) => {
    const date = new Date(item.date);
    years.push(date.getFullYear());
  });

  return [...new Set(years)];
};

const dotToComma = (number: number): string =>
  number.toString().replace(".", ",");

export const getSizeText = (item: Work): string =>
  item.type === Type.SCULPTURE
    ? `${dotToComma(item.height)} x ${dotToComma(item.width)} x ${dotToComma(item.length)} cm`
    : `${dotToComma(item.height)} x ${dotToComma(item.width)} cm`;

export const sortDragList = (
  dragList: DragListElement[],
): DragListElement[] => {
  function compare(a: DragListElement, b: DragListElement) {
    return a.order - b.order;
  }
  return dragList.toSorted(compare);
};

export const worksIsEmpty = (works: Work[]): boolean =>
  works.length === 1 && works[0].id === 0;

export const filterWorks = (workFulls: Work[], filter: Filter): Work[] => {
  function filterByCategory(list: Work[]) {
    return filter.categoryFilter === -1
      ? list
      : filter.categoryFilter === 0
        ? list.filter((i) => !i.categoryId)
        : list.filter((i) => i.categoryId === filter.categoryFilter);
  }
  function filterByYear(list: Work[]) {
    return filter.yearFilter === -1
      ? list
      : list.filter(
          (i) => new Date(i.date).getFullYear() === filter.yearFilter,
        );
  }
  function filterByIsOut(list: Work[]) {
    return filter.isOutFilter === -1
      ? list
      : filter.isOutFilter === 0
        ? list.filter((i) => !i.isOut)
        : list.filter((i) => i.isOut);
  }
  return filterByCategory(filterByYear(filterByIsOut(workFulls)));
};
