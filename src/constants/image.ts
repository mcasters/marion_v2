import { Layout } from "@/lib/type.ts";

export const IMAGE = {
  SM_PX: 384,
  MD_PX: 640,
  MAX_PX: 2000,
};

export const DEVICE = {
  SMALL: 768,
  MEDIUM: 1200,
};

export const IMAGE_INFO = {
  [Layout.MONO]: {
    WIDTH: {
      small: 80,
      large: 40,
    },
    HEIGHT: {
      small: 45,
      large: 58,
    },
  },
  [Layout.DOUBLE]: {
    WIDTH: {
      small: 80,
      large: 32,
    },
    HEIGHT: {
      small: 45,
      large: 52,
    },
  },
  [Layout.SCULPTURE]: {
    WIDTH: {
      small: 80,
      large: 25,
    },
    HEIGHT: {
      small: 45,
      large: 40,
    },
  },
};
