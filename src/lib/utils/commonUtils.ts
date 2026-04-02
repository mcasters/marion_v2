import {
  AdminCategory,
  Category,
  ContentFull,
  DragListElement,
  Filter,
  HomeLayout,
  Image,
  ItemDarkBackground,
  Layout,
  Message,
  Meta,
  Post,
  Work,
} from "@/lib/type.ts";
import { KEY_META } from "@/constants/admin.ts";
import { LABEL, TYPE } from "@/db/schema.ts";

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
  contents?.filter((c) => c.label === LABEL.SLIDER)[0] || null;

export const getPresentation = (contents: ContentFull[]): string =>
  contents?.filter((c) => c.label === LABEL.PRESENTATION)[0]?.text || "";

export const getPresentationImage = (contents: ContentFull[]): Image[] =>
  contents?.filter((c) => c.label === LABEL.PRESENTATION)[0]?.images || [];

export const getDemarche = (contents: ContentFull[]): string =>
  contents?.filter((c) => c.label === LABEL.DEMARCHE)[0]?.text || "";

export const getInspiration = (contents: ContentFull[]): string =>
  contents?.filter((c) => c.label === LABEL.INSPIRATION)[0]?.text || "";

export const getIntroText = (contents: ContentFull[]): string =>
  contents?.filter((c) => c.label === LABEL.INTRO)[0]?.text || "";

export const getSliders = (contents: ContentFull[]): Image[] | [] =>
  contents?.filter((c) => c.label === LABEL.SLIDER)[0]?.images || [];

export const getAddress = (contents: ContentFull[]): string =>
  contents?.filter((c) => c.label === LABEL.ADDRESS)[0]?.text || "";

export const getPhone = (contents: ContentFull[]): string =>
  contents?.filter((c) => c.label === LABEL.PHONE)[0]?.text || "";

export const getEmail = (contents: ContentFull[]): string =>
  contents?.filter((c) => c.label === LABEL.EMAIL)[0]?.text || "";

export const getContactText = (contents: ContentFull[]): string =>
  contents?.filter((c) => c.label === LABEL.TEXT_CONTACT)[0]?.text || "";

export const getMetaMap = (metas: Meta[]): Map<string, string> => {
  const map = new Map();
  metas.forEach((meta) => map.set(meta.key, meta.text));
  return map;
};

export const getThumbnailSrc = (item: AdminCategory | Work | Post) => {
  if (item.id === 0) return "";

  switch (item.type) {
    case TYPE.CATEGORY: {
      return item.imageFilename !== ""
        ? `/images/${item.workType}/sm/${item.imageFilename}`
        : "";
    }
    case TYPE.POST: {
      let image = item.images.find((i: Image) => i.isMain);
      if (!image) image = item.images[0];
      return image && image.filename !== ""
        ? `/images/post/${image.filename}`
        : "";
    }
    default: {
      return item.images[0] && item.images[0].filename !== ""
        ? `/images/${item.type}/${item.images[0].filename}`
        : "";
    }
  }
};

export const getEmptyWork = (
  type: TYPE.SCULPTURE | TYPE.DRAWING | TYPE.PAINTING,
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
    price: null,
    sold: false,
    images: [],
    categoryId: null,
    isOut: false,
    outInformation: "",
  };
};

export const getEmptyPost = (): Post => {
  return {
    id: 0,
    type: TYPE.POST,
    title: "",
    date: new Date(),
    createdAt: new Date(),
    text: "",
    images: [{ ...getEmptyImage(), postId: 0 }],
    published: false,
    viewCount: 0,
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

export const getEmptyAdminCategory = (
  workType: TYPE.PAINTING | TYPE.DRAWING | TYPE.SCULPTURE,
): AdminCategory => {
  return {
    id: 0,
    key: "",
    value: "",
    type: TYPE.CATEGORY,
    workType,
    title: "",
    text: "",
    imageFilename: "",
    filenames: [],
    count: 0,
  };
};

export const getNoCategory = (
  workType: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING,
): Category => {
  return {
    id: 0,
    key: "no-category",
    value: "Sans catégorie",
    type: TYPE.CATEGORY,
    workType,
    title: "",
    text: "",
    imageFilename: "",
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
      isAdmin: false,
    },
  };
};

export const getWorkLayout = (
  metas: Map<string, string>,
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING,
): [Layout, ItemDarkBackground] => {
  const metaLayout =
    type === TYPE.PAINTING
      ? metas.get(KEY_META.PAINTING_LAYOUT) || "1,1"
      : type === TYPE.SCULPTURE
        ? metas.get(KEY_META.SCULPTURE_LAYOUT) || "3,1"
        : metas.get(KEY_META.DRAWING_LAYOUT) || "1,1";

  const strings = metaLayout.split(",");
  return [parseInt(strings[0]), parseInt(strings[1])];
};

export const getHomeLayout = (metas: Map<string, string>): HomeLayout => {
  return parseInt(metas.get(KEY_META.HOME_LAYOUT) || "0");
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
  item.type === TYPE.SCULPTURE
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

export const filterWorks = (works: Work[], filter: Filter): Work[] => {
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
  return filterByCategory(filterByYear(filterByIsOut(works)));
};
