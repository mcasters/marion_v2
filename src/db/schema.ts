import {
  boolean,
  datetime,
  double,
  index,
  int,
  longtext,
  mysqlEnum,
  mysqlTable,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export enum TYPE {
  PAINTING = "peinture",
  SCULPTURE = "sculpture",
  POST = "post",
  DRAWING = "dessin",
  CATEGORY = "catégorie",
}

export enum LABEL {
  INTRO = "INTRO",
  SLIDER = "SLIDER",
  ADDRESS = "ADDRESS",
  PHONE = "PHONE",
  EMAIL = "EMAIL",
  TEXT_CONTACT = "TEXT_CONTACT",
  PRESENTATION = "PRESENTATION",
  DEMARCHE = "DEMARCHE",
  INSPIRATION = "INSPIRATION",
}

export const content = mysqlTable(
  "Content",
  {
    id: int().autoincrement().primaryKey(),
    text: longtext().notNull(),
    label: mysqlEnum(LABEL).notNull(),
    title: varchar({ length: 191 }),
  },
  (table) => [unique("Content_label_key").on(table.label)],
);

export const contentImage = mysqlTable(
  "ContentImage",
  {
    id: int().autoincrement().primaryKey(),
    filename: varchar({ length: 191 }).notNull(),
    width: int().notNull(),
    height: int().notNull(),
    isMain: boolean().default(false).notNull(),
    contentId: int().references(() => content.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
  },
  (table) => [
    index("ContentImage_contentId_fkey").on(table.contentId),
    unique("ContentImage_filename_key").on(table.filename),
  ],
);

export const drawing = mysqlTable(
  "Drawing",
  {
    id: int().autoincrement().primaryKey(),
    title: varchar({ length: 191 }).notNull(),
    date: datetime({ mode: "date", fsp: 3 }).notNull(),
    technique: longtext().notNull(),
    description: longtext().notNull(),
    height: double().notNull(),
    width: double().notNull(),
    createdAt: datetime({ mode: "date", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
    categoryId: int().references(() => drawingCategory.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    imageFilename: varchar({ length: 191 }).default("").notNull(),
    imageHeight: int().default(0).notNull(),
    imageWidth: int().default(0).notNull(),
    isToSell: boolean().default(false).notNull(),
    price: int(),
    sold: boolean().default(false).notNull(),
    type: varchar({ length: 191 })
      .$type<TYPE.DRAWING>()
      .default(TYPE.DRAWING)
      .notNull(),
    isOut: boolean().default(false).notNull(),
    outInformation: varchar({ length: 191 }).default("").notNull(),
  },
  (table) => [
    index("Drawing_categoryId_fkey").on(table.categoryId),
    unique("Drawing_title_key").on(table.title),
  ],
);

export const drawingCategory = mysqlTable(
  "DrawingCategory",
  {
    id: int().autoincrement().primaryKey(),
    key: varchar({ length: 191 }).notNull(),
    value: varchar({ length: 191 }).notNull(),
    type: varchar({ length: 191 })
      .$type<TYPE.CATEGORY>()
      .default(TYPE.CATEGORY)
      .notNull(),
    workType: varchar({ length: 191 })
      .$type<TYPE.DRAWING>()
      .default(TYPE.DRAWING)
      .notNull(),
    title: varchar({ length: 191 }).default("").notNull(),
    text: longtext().notNull(),
    imageFilename: varchar({ length: 191 }).default("").notNull(),
  },
  (table) => [
    unique("DrawingCategory_key_key").on(table.key),
    unique("DrawingCategory_value_key").on(table.value),
  ],
);

export const message = mysqlTable("Message", {
  id: int().autoincrement().primaryKey(),
  date: datetime({ mode: "date", fsp: 3 }).notNull(),
  text: longtext().notNull(),
  userId: int()
    .notNull()
    .references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
  dateUpdated: datetime({ mode: "date", fsp: 3 }),
});

export const meta = mysqlTable(
  "Meta",
  {
    id: int().autoincrement().primaryKey(),
    key: varchar({ length: 191 }).notNull(),
    text: longtext().notNull(),
  },
  (table) => [unique("Meta_key_key").on(table.key)],
);

export const painting = mysqlTable(
  "Painting",
  {
    id: int().autoincrement().primaryKey(),
    title: varchar({ length: 191 }).notNull(),
    date: datetime({ mode: "date", fsp: 3 }).notNull(),
    technique: longtext().notNull(),
    description: longtext().notNull(),
    height: double().notNull(),
    width: double().notNull(),
    createdAt: datetime({ mode: "date", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
    categoryId: int().references(() => paintingCategory.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    imageFilename: varchar({ length: 191 }).default("").notNull(),
    imageHeight: int().default(0).notNull(),
    imageWidth: int().default(0).notNull(),
    isToSell: boolean().default(false).notNull(),
    price: int(),
    sold: boolean().default(false).notNull(),
    type: varchar({ length: 191 })
      .$type<TYPE.PAINTING>()
      .default(TYPE.PAINTING)
      .notNull(),
    isOut: boolean().default(false).notNull(),
    outInformation: varchar({ length: 191 }).default("").notNull(),
  },
  (table) => [
    index("Painting_categoryId_fkey").on(table.categoryId),
    unique("Painting_title_key").on(table.title),
  ],
);

export const paintingCategory = mysqlTable(
  "PaintingCategory",
  {
    id: int().autoincrement().primaryKey(),
    key: varchar({ length: 191 }).notNull(),
    value: varchar({ length: 191 }).notNull(),
    type: varchar({ length: 191 })
      .$type<TYPE.CATEGORY>()
      .default(TYPE.CATEGORY)
      .notNull(),
    workType: varchar({ length: 191 })
      .$type<TYPE.PAINTING>()
      .default(TYPE.PAINTING)
      .notNull(),
    title: varchar({ length: 191 }).default("").notNull(),
    text: longtext().notNull(),
    imageFilename: varchar({ length: 191 }).default("").notNull(),
  },
  (table) => [
    unique("PaintingCategory_key_key").on(table.key),
    unique("PaintingCategory_value_key").on(table.value),
  ],
);

export const post = mysqlTable(
  "Post",
  {
    id: int().autoincrement().primaryKey(),
    type: varchar({ length: 191 })
      .$type<TYPE.POST>()
      .default(TYPE.POST)
      .notNull(),
    title: varchar({ length: 191 }).notNull(),
    date: datetime({ mode: "date", fsp: 3 }).notNull(),
    createdAt: datetime({ mode: "date", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
    text: longtext().notNull(),
    published: boolean().default(false).notNull(),
    viewCount: int().default(0).notNull(),
  },
  (table) => [unique("Post_title_key").on(table.title)],
);

export const postImage = mysqlTable(
  "PostImage",
  {
    id: int().autoincrement().primaryKey(),
    filename: varchar({ length: 191 }).notNull(),
    width: int().notNull(),
    height: int().notNull(),
    isMain: boolean().default(false).notNull(),
    postId: int().references(() => post.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
  },
  (table) => [
    index("PostImage_postId_fkey").on(table.postId),
    unique("PostImage_filename_key").on(table.filename),
  ],
);

export const presetColor = mysqlTable(
  "PresetColor",
  {
    id: int().autoincrement().primaryKey(),
    name: varchar({ length: 191 }).notNull(),
    color: varchar({ length: 191 }).notNull(),
    displayOrder: int().default(1).notNull(),
  },
  (table) => [unique("PresetColor_name_key").on(table.name)],
);

export const sculpture = mysqlTable(
  "Sculpture",
  {
    id: int().autoincrement().primaryKey(),
    title: varchar({ length: 191 }).notNull(),
    date: datetime({ mode: "date", fsp: 3 }).notNull(),
    technique: longtext().notNull(),
    description: longtext().notNull(),
    height: double().notNull(),
    width: double().notNull(),
    length: double().notNull(),
    createdAt: datetime({ mode: "date", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
    categoryId: int().references(() => sculptureCategory.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    isToSell: boolean().default(false).notNull(),
    price: int(),
    sold: boolean().default(false).notNull(),
    type: varchar({ length: 191 })
      .$type<TYPE.SCULPTURE>()
      .default(TYPE.SCULPTURE)
      .notNull(),
    isOut: boolean().default(false).notNull(),
    outInformation: varchar({ length: 191 }).default("").notNull(),
  },
  (table) => [
    index("Sculpture_categoryId_fkey").on(table.categoryId),
    unique("Sculpture_title_key").on(table.title),
  ],
);

export const sculptureCategory = mysqlTable(
  "SculptureCategory",
  {
    id: int().autoincrement().primaryKey(),
    key: varchar({ length: 191 }).notNull(),
    value: varchar({ length: 191 }).notNull(),
    type: varchar({ length: 191 })
      .$type<TYPE.CATEGORY>()
      .default(TYPE.CATEGORY)
      .notNull(),
    workType: varchar({ length: 191 })
      .$type<TYPE.SCULPTURE>()
      .default(TYPE.SCULPTURE)
      .notNull(),
    title: varchar({ length: 191 }).default("").notNull(),
    text: longtext().notNull(),
    imageFilename: varchar({ length: 191 }).default("").notNull(),
  },
  (table) => [
    unique("SculptureCategory_key_key").on(table.key),
    unique("SculptureCategory_value_key").on(table.value),
  ],
);

export const sculptureImage = mysqlTable(
  "SculptureImage",
  {
    id: int().autoincrement().primaryKey(),
    filename: varchar({ length: 191 }).notNull(),
    width: int().notNull(),
    height: int().notNull(),
    isMain: boolean().default(false).notNull(),
    sculptureId: int().references(() => sculpture.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
  },
  (table) => [
    index("SculptureImage_sculptureId_fkey").on(table.sculptureId),
    unique("SculptureImage_filename_key").on(table.filename),
  ],
);

export const theme = mysqlTable(
  "Theme",
  {
    id: int().autoincrement().primaryKey(),
    name: varchar({ length: 191 }).notNull(),
    isActive: boolean().default(false).notNull(),
    general_lineColor: varchar({ length: 191 }).notNull(),
    general_titleColor: varchar({ length: 191 }).notNull(),
    general_lightbox: varchar({ length: 191 }).notNull(),
    general_lightboxText: varchar({
      length: 191,
    }).notNull(),
    home_menu1_background: varchar({
      length: 191,
    }).notNull(),
    home_menu1_text: varchar({ length: 191 }).notNull(),
    home_menu1_link: varchar({ length: 191 }).notNull(),
    home_menu1_linkHover: varchar({
      length: 191,
    }).notNull(),
    home_menu2_background: varchar({
      length: 191,
    }).notNull(),
    home_menu2_text: varchar({ length: 191 }).notNull(),
    home_menu2_link: varchar({ length: 191 }).notNull(),
    home_menu2_linkHover: varchar({
      length: 191,
    }).notNull(),
    home_main_background: varchar({
      length: 191,
    }).notNull(),
    home_main_text: varchar({ length: 191 }).notNull(),
    home_main_link: varchar({ length: 191 }).notNull(),
    home_main_linkHover: varchar({
      length: 191,
    }).notNull(),
    home_footer_background: varchar({
      length: 191,
    }).notNull(),
    home_footer_text: varchar({ length: 191 }).notNull(),
    home_footer_link: varchar({ length: 191 }).notNull(),
    home_footer_linkHover: varchar({
      length: 191,
    }).notNull(),
    work_menu1_background: varchar({
      length: 191,
    }).notNull(),
    work_menu1_text: varchar({ length: 191 }).notNull(),
    work_menu1_link: varchar({ length: 191 }).notNull(),
    work_menu1_linkHover: varchar({
      length: 191,
    }).notNull(),
    work_menu2_background: varchar({
      length: 191,
    }).notNull(),
    work_menu2_text: varchar({ length: 191 }).notNull(),
    work_menu2_link: varchar({ length: 191 }).notNull(),
    work_menu2_linkHover: varchar({
      length: 191,
    }).notNull(),
    work_main_background: varchar({
      length: 191,
    }).notNull(),
    work_main_text: varchar({ length: 191 }).notNull(),
    work_main_link: varchar({
      length: 191,
    }).notNull(),
    work_main_linkHover: varchar({
      length: 191,
    }).notNull(),
    work_footer_background: varchar({
      length: 191,
    }).notNull(),
    work_footer_text: varchar({ length: 191 }).notNull(),
    work_footer_link: varchar({ length: 191 }).notNull(),
    work_footer_linkHover: varchar({
      length: 191,
    }).notNull(),
    other_menu1_background: varchar({
      length: 191,
    }).notNull(),
    other_menu1_text: varchar({ length: 191 }).notNull(),
    other_menu1_link: varchar({ length: 191 }).notNull(),
    other_menu1_linkHover: varchar({
      length: 191,
    }).notNull(),
    other_menu2_background: varchar({
      length: 191,
    }).notNull(),
    other_menu2_text: varchar({ length: 191 }).notNull(),
    other_menu2_link: varchar({ length: 191 }).notNull(),
    other_menu2_linkHover: varchar({
      length: 191,
    }).notNull(),
    other_main_background: varchar({
      length: 191,
    }).notNull(),
    other_main_text: varchar({ length: 191 }).notNull(),
    other_main_link: varchar({ length: 191 }).notNull(),
    other_main_linkHover: varchar({
      length: 191,
    }).notNull(),
    other_footer_background: varchar({
      length: 191,
    }).notNull(),
    other_footer_text: varchar({ length: 191 }).notNull(),
    other_footer_link: varchar({ length: 191 }).notNull(),
    other_footer_linkHover: varchar({
      length: 191,
    }).notNull(),
  },
  (table) => [unique("Theme_name_key").on(table.name)],
);

export const user = mysqlTable(
  "User",
  {
    id: int().autoincrement().primaryKey(),
    email: varchar({ length: 191 }).notNull(),
    password: varchar({ length: 191 }).notNull(),
    isAdmin: boolean().default(true).notNull(),
  },
  (table) => [unique("User_email_key").on(table.email)],
);
