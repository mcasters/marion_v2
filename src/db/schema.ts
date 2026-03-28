import {
  boolean,
  datetime,
  double,
  index,
  int,
  longtext,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const categoryContent = mysqlTable(
  "CategoryContent",
  {
    id: int().autoincrement().notNull(),
    title: varchar({ length: 191 }).default("").notNull(),
    text: longtext().notNull(),
    imageFilename: varchar({ length: 191 }).default("").notNull(),
    imageWidth: int().default(0).notNull(),
    imageHeight: int().default(0).notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: "CategoryContent_id" })],
);

export const content = mysqlTable(
  "Content",
  {
    id: int().autoincrement().notNull(),
    text: longtext().notNull(),
    label: mysqlEnum([
      "INTRO",
      "SLIDER",
      "ADDRESS",
      "PHONE",
      "EMAIL",
      "TEXT_CONTACT",
      "PRESENTATION",
      "DEMARCHE",
      "INSPIRATION",
    ]).notNull(),
    title: varchar({ length: 191 }),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "Content_id" }),
    unique("Content_label_key").on(table.label),
  ],
);

export const contentImage = mysqlTable(
  "ContentImage",
  {
    id: int().autoincrement().notNull(),
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
    primaryKey({ columns: [table.id], name: "ContentImage_id" }),
    unique("ContentImage_filename_key").on(table.filename),
  ],
);

export const drawing = mysqlTable(
  "Drawing",
  {
    id: int().autoincrement().notNull(),
    title: varchar({ length: 191 }).notNull(),
    date: datetime({ mode: "string", fsp: 3 }).notNull(),
    technique: longtext().notNull(),
    description: longtext().notNull(),
    height: double().notNull(),
    width: double().notNull(),
    createdAt: datetime({ mode: "string", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
    updatedAt: datetime({ mode: "string", fsp: 3 }).notNull(),
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
    type: varchar({ length: 191 }).default("dessin").notNull(),
    isOut: boolean().default(false).notNull(),
    outInformation: varchar({ length: 191 }).default("").notNull(),
  },
  (table) => [
    index("Drawing_categoryId_fkey").on(table.categoryId),
    primaryKey({ columns: [table.id], name: "Drawing_id" }),
    unique("Drawing_title_key").on(table.title),
  ],
);

export const drawingCategory = mysqlTable(
  "DrawingCategory",
  {
    id: int().autoincrement().notNull(),
    key: varchar({ length: 191 }).notNull(),
    value: varchar({ length: 191 }).notNull(),
    categoryContentId: int()
      .notNull()
      .references(() => categoryContent.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "DrawingCategory_id" }),
    unique("DrawingCategory_key_key").on(table.key),
    unique("DrawingCategory_value_key").on(table.value),
    unique("DrawingCategory_categoryContentId_key").on(table.categoryContentId),
  ],
);

export const message = mysqlTable(
  "Message",
  {
    id: int().autoincrement().notNull(),
    date: datetime({ mode: "string", fsp: 3 }).notNull(),
    text: longtext().notNull(),
    userId: int()
      .notNull()
      .references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
    dateUpdated: datetime({ mode: "string", fsp: 3 }),
  },
  (table) => [primaryKey({ columns: [table.id], name: "Message_id" })],
);

export const meta = mysqlTable(
  "Meta",
  {
    id: int().autoincrement().notNull(),
    key: varchar({ length: 191 }).notNull(),
    text: longtext().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "Meta_id" }),
    unique("Meta_key_key").on(table.key),
  ],
);

export const painting = mysqlTable(
  "Painting",
  {
    id: int().autoincrement().notNull(),
    title: varchar({ length: 191 }).notNull(),
    date: datetime({ mode: "string", fsp: 3 }).notNull(),
    technique: longtext().notNull(),
    description: longtext().notNull(),
    height: double().notNull(),
    width: double().notNull(),
    createdAt: datetime({ mode: "string", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
    updatedAt: datetime({ mode: "string", fsp: 3 }).notNull(),
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
    type: varchar({ length: 191 }).default("peinture").notNull(),
    isOut: boolean().default(false).notNull(),
    outInformation: varchar({ length: 191 }).default("").notNull(),
  },
  (table) => [
    index("Painting_categoryId_fkey").on(table.categoryId),
    primaryKey({ columns: [table.id], name: "Painting_id" }),
    unique("Painting_title_key").on(table.title),
  ],
);

export const paintingCategory = mysqlTable(
  "PaintingCategory",
  {
    id: int().autoincrement().notNull(),
    key: varchar({ length: 191 }).notNull(),
    value: varchar({ length: 191 }).notNull(),
    categoryContentId: int()
      .notNull()
      .references(() => categoryContent.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "PaintingCategory_id" }),
    unique("PaintingCategory_key_key").on(table.key),
    unique("PaintingCategory_value_key").on(table.value),
    unique("PaintingCategory_categoryContentId_key").on(
      table.categoryContentId,
    ),
  ],
);

export const post = mysqlTable(
  "Post",
  {
    id: int().autoincrement().notNull(),
    type: varchar({ length: 191 }).default("post").notNull(),
    title: varchar({ length: 191 }).notNull(),
    date: datetime({ mode: "string", fsp: 3 }).notNull(),
    createdAt: datetime({ mode: "string", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
    updatedAt: datetime({ mode: "string", fsp: 3 }).notNull(),
    text: longtext().notNull(),
    published: boolean().default(false).notNull(),
    viewCount: int().default(0).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "Post_id" }),
    unique("Post_title_key").on(table.title),
  ],
);

export const postImage = mysqlTable(
  "PostImage",
  {
    id: int().autoincrement().notNull(),
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
    primaryKey({ columns: [table.id], name: "PostImage_id" }),
    unique("PostImage_filename_key").on(table.filename),
  ],
);

export const presetColor = mysqlTable(
  "PresetColor",
  {
    id: int().autoincrement().notNull(),
    name: varchar({ length: 191 }).notNull(),
    color: varchar({ length: 191 }).notNull(),
    displayOrder: int().default(1).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "PresetColor_id" }),
    unique("PresetColor_name_key").on(table.name),
  ],
);

export const sculpture = mysqlTable(
  "Sculpture",
  {
    id: int().autoincrement().notNull(),
    title: varchar({ length: 191 }).notNull(),
    date: datetime({ mode: "string", fsp: 3 }).notNull(),
    technique: longtext().notNull(),
    description: longtext().notNull(),
    height: double().notNull(),
    width: double().notNull(),
    length: double().notNull(),
    createdAt: datetime({ mode: "string", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
    updatedAt: datetime({ mode: "string", fsp: 3 }).notNull(),
    categoryId: int().references(() => sculptureCategory.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    isToSell: boolean().default(false).notNull(),
    price: int(),
    sold: boolean().default(false).notNull(),
    type: varchar({ length: 191 }).default("sculpture").notNull(),
    isOut: boolean().default(false).notNull(),
    outInformation: varchar({ length: 191 }).default("").notNull(),
  },
  (table) => [
    index("Sculpture_categoryId_fkey").on(table.categoryId),
    primaryKey({ columns: [table.id], name: "Sculpture_id" }),
    unique("Sculpture_title_key").on(table.title),
  ],
);

export const sculptureCategory = mysqlTable(
  "SculptureCategory",
  {
    id: int().autoincrement().notNull(),
    key: varchar({ length: 191 }).notNull(),
    value: varchar({ length: 191 }).notNull(),
    categoryContentId: int()
      .notNull()
      .references(() => categoryContent.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "SculptureCategory_id" }),
    unique("SculptureCategory_key_key").on(table.key),
    unique("SculptureCategory_value_key").on(table.value),
    unique("SculptureCategory_categoryContentId_key").on(
      table.categoryContentId,
    ),
  ],
);

export const sculptureImage = mysqlTable(
  "SculptureImage",
  {
    id: int().autoincrement().notNull(),
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
    primaryKey({ columns: [table.id], name: "SculptureImage_id" }),
    unique("SculptureImage_filename_key").on(table.filename),
  ],
);

export const theme = mysqlTable(
  "Theme",
  {
    id: int().autoincrement().notNull(),
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
  (table) => [
    primaryKey({ columns: [table.id], name: "Theme_id" }),
    unique("Theme_name_key").on(table.name),
  ],
);

export const user = mysqlTable(
  "User",
  {
    id: int().autoincrement().notNull(),
    email: varchar({ length: 191 }).notNull(),
    password: varchar({ length: 191 }).notNull(),
    isAdmin: boolean().default(true).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "User_id" }),
    unique("User_email_key").on(table.email),
  ],
);
