import {
  datetime,
  double,
  int,
  longtext,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  tinyint,
  unique,
  varchar
} from "drizzle-orm/mysql-core"
import {sql} from "drizzle-orm"

export const categoryContent = mysqlTable("CategoryContent", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 191 }).default('').notNull(),
	text: longtext().notNull(),
	imageFilename: varchar({ length: 191 }).default('').notNull(),
	imageWidth: int().default(0).notNull(),
	imageHeight: int().default(0).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "CategoryContent_id"}),
]);

export const content = mysqlTable("Content", {
	id: int().autoincrement().notNull(),
	text: longtext().notNull(),
	label: mysqlEnum(['INTRO','SLIDER','ADDRESS','PHONE','EMAIL','TEXT_CONTACT','PRESENTATION','DEMARCHE','INSPIRATION']).notNull(),
	title: varchar({ length: 191 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "Content_id"}),
	unique("Content_label_key").on(table.label),
]);

export const contentImage = mysqlTable("ContentImage", {
	id: int().autoincrement().notNull(),
	filename: varchar({ length: 191 }).notNull(),
	width: int().notNull(),
	height: int().notNull(),
	isMain: tinyint().default(0).notNull(),
	contentId: int().references(() => content.id, { onDelete: "set null", onUpdate: "cascade" } ),
},
(table) => [
	primaryKey({ columns: [table.id], name: "ContentImage_id"}),
	unique("ContentImage_filename_key").on(table.filename),
]);

export const drawing = mysqlTable("Drawing", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 191 }).notNull(),
	date: datetime({ mode: 'string', fsp: 3 }).notNull(),
	technique: longtext().notNull(),
	description: longtext().notNull(),
	height: double().notNull(),
	width: double().notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull(),
	categoryId: int().references(() => drawingCategory.id, { onDelete: "set null", onUpdate: "cascade" } ),
	imageFilename: varchar({ length: 191 }).default('').notNull(),
	imageHeight: int().default(0).notNull(),
	imageWidth: int().default(0).notNull(),
	isToSell: tinyint().default(0).notNull(),
	price: int(),
	sold: tinyint().default(0).notNull(),
	type: varchar({ length: 191 }).default('dessin').notNull(),
	isOut: tinyint().default(0).notNull(),
	outInformation: varchar({ length: 191 }).default('').notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "Drawing_id"}),
	unique("Drawing_title_key").on(table.title),
]);

export const drawingCategory = mysqlTable("DrawingCategory", {
	id: int().autoincrement().notNull(),
	key: varchar({ length: 191 }).notNull(),
	value: varchar({ length: 191 }).notNull(),
	categoryContentId: int().notNull().references(() => categoryContent.id, { onDelete: "restrict", onUpdate: "cascade" } ),
},
(table) => [
	primaryKey({ columns: [table.id], name: "DrawingCategory_id"}),
	unique("DrawingCategory_key_key").on(table.key),
	unique("DrawingCategory_value_key").on(table.value),
	unique("DrawingCategory_categoryContentId_key").on(table.categoryContentId),
]);

export const message = mysqlTable("Message", {
	id: int().autoincrement().notNull(),
	date: datetime({ mode: 'string', fsp: 3 }).notNull(),
	text: longtext().notNull(),
	userId: int().notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	dateUpdated: datetime({ mode: 'string', fsp: 3 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "Message_id"}),
]);

export const meta = mysqlTable("Meta", {
	id: int().autoincrement().notNull(),
	key: varchar({ length: 191 }).notNull(),
	text: longtext().notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "Meta_id"}),
	unique("Meta_key_key").on(table.key),
]);

export const painting = mysqlTable("Painting", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 191 }).notNull(),
	date: datetime({ mode: 'string', fsp: 3 }).notNull(),
	technique: longtext().notNull(),
	description: longtext().notNull(),
	height: double().notNull(),
	width: double().notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull(),
	categoryId: int().references(() => paintingCategory.id, { onDelete: "set null", onUpdate: "cascade" } ),
	imageFilename: varchar({ length: 191 }).default('').notNull(),
	imageHeight: int().default(0).notNull(),
	imageWidth: int().default(0).notNull(),
	isToSell: tinyint().default(0).notNull(),
	price: int(),
	sold: tinyint().default(0).notNull(),
	type: varchar({ length: 191 }).default('peinture').notNull(),
	isOut: tinyint().default(0).notNull(),
	outInformation: varchar({ length: 191 }).default('').notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "Painting_id"}),
	unique("Painting_title_key").on(table.title),
]);

export const paintingCategory = mysqlTable("PaintingCategory", {
	id: int().autoincrement().notNull(),
	key: varchar({ length: 191 }).notNull(),
	value: varchar({ length: 191 }).notNull(),
	categoryContentId: int().notNull().references(() => categoryContent.id, { onDelete: "restrict", onUpdate: "cascade" } ),
},
(table) => [
	primaryKey({ columns: [table.id], name: "PaintingCategory_id"}),
	unique("PaintingCategory_key_key").on(table.key),
	unique("PaintingCategory_value_key").on(table.value),
	unique("PaintingCategory_categoryContentId_key").on(table.categoryContentId),
]);

export const post = mysqlTable("Post", {
	id: int().autoincrement().notNull(),
	type: varchar({ length: 191 }).default('post').notNull(),
	title: varchar({ length: 191 }).notNull(),
	date: datetime({ mode: 'string', fsp: 3 }).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull(),
	text: longtext().notNull(),
	published: tinyint().default(0).notNull(),
	viewCount: int().default(0).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "Post_id"}),
	unique("Post_title_key").on(table.title),
]);

export const postImage = mysqlTable("PostImage", {
	id: int().autoincrement().notNull(),
	filename: varchar({ length: 191 }).notNull(),
	width: int().notNull(),
	height: int().notNull(),
	isMain: tinyint().default(0).notNull(),
	postId: int().references(() => post.id, { onDelete: "set null", onUpdate: "cascade" } ),
},
(table) => [
	primaryKey({ columns: [table.id], name: "PostImage_id"}),
	unique("PostImage_filename_key").on(table.filename),
]);

export const presetColor = mysqlTable("PresetColor", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 191 }).notNull(),
	color: varchar({ length: 191 }).notNull(),
	displayOrder: int().default(1).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "PresetColor_id"}),
	unique("PresetColor_name_key").on(table.name),
]);

export const sculpture = mysqlTable("Sculpture", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 191 }).notNull(),
	date: datetime({ mode: 'string', fsp: 3 }).notNull(),
	technique: longtext().notNull(),
	description: longtext().notNull(),
	height: double().notNull(),
	width: double().notNull(),
	length: double().notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull(),
	categoryId: int().references(() => sculptureCategory.id, { onDelete: "set null", onUpdate: "cascade" } ),
	isToSell: tinyint().default(0).notNull(),
	price: int(),
	sold: tinyint().default(0).notNull(),
	type: varchar({ length: 191 }).default('sculpture').notNull(),
	isOut: tinyint().default(0).notNull(),
	outInformation: varchar({ length: 191 }).default('').notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "Sculpture_id"}),
	unique("Sculpture_title_key").on(table.title),
]);

export const sculptureCategory = mysqlTable("SculptureCategory", {
	id: int().autoincrement().notNull(),
	key: varchar({ length: 191 }).notNull(),
	value: varchar({ length: 191 }).notNull(),
	categoryContentId: int().notNull().references(() => categoryContent.id, { onDelete: "restrict", onUpdate: "cascade" } ),
},
(table) => [
	primaryKey({ columns: [table.id], name: "SculptureCategory_id"}),
	unique("SculptureCategory_key_key").on(table.key),
	unique("SculptureCategory_value_key").on(table.value),
	unique("SculptureCategory_categoryContentId_key").on(table.categoryContentId),
]);

export const sculptureImage = mysqlTable("SculptureImage", {
	id: int().autoincrement().notNull(),
	filename: varchar({ length: 191 }).notNull(),
	width: int().notNull(),
	height: int().notNull(),
	isMain: tinyint().default(0).notNull(),
	sculptureId: int().references(() => sculpture.id, { onDelete: "set null", onUpdate: "cascade" } ),
},
(table) => [
	primaryKey({ columns: [table.id], name: "SculptureImage_id"}),
	unique("SculptureImage_filename_key").on(table.filename),
]);

export const theme = mysqlTable("Theme", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 191 }).notNull(),
	isActive: tinyint().default(0).notNull(),
	generalLineColor: varchar("general_lineColor", { length: 191 }).notNull(),
	generalTitleColor: varchar("general_titleColor", { length: 191 }).notNull(),
	generalLightbox: varchar("general_lightbox", { length: 191 }).notNull(),
	generalLightboxText: varchar("general_lightboxText", { length: 191 }).notNull(),
	homeMenu1Background: varchar("home_menu1_background", { length: 191 }).notNull(),
	homeMenu1Text: varchar("home_menu1_text", { length: 191 }).notNull(),
	homeMenu1Link: varchar("home_menu1_link", { length: 191 }).notNull(),
	homeMenu1LinkHover: varchar("home_menu1_linkHover", { length: 191 }).notNull(),
	homeMenu2Background: varchar("home_menu2_background", { length: 191 }).notNull(),
	homeMenu2Text: varchar("home_menu2_text", { length: 191 }).notNull(),
	homeMenu2Link: varchar("home_menu2_link", { length: 191 }).notNull(),
	homeMenu2LinkHover: varchar("home_menu2_linkHover", { length: 191 }).notNull(),
	homeMainBackground: varchar("home_main_background", { length: 191 }).notNull(),
	homeMainText: varchar("home_main_text", { length: 191 }).notNull(),
	homeMainLink: varchar("home_main_link", { length: 191 }).notNull(),
	homeMainLinkHover: varchar("home_main_linkHover", { length: 191 }).notNull(),
	homeFooterBackground: varchar("home_footer_background", { length: 191 }).notNull(),
	homeFooterText: varchar("home_footer_text", { length: 191 }).notNull(),
	homeFooterLink: varchar("home_footer_link", { length: 191 }).notNull(),
	homeFooterLinkHover: varchar("home_footer_linkHover", { length: 191 }).notNull(),
	workMenu1Background: varchar("work_menu1_background", { length: 191 }).notNull(),
	workMenu1Text: varchar("work_menu1_text", { length: 191 }).notNull(),
	workMenu1Link: varchar("work_menu1_link", { length: 191 }).notNull(),
	workMenu1LinkHover: varchar("work_menu1_linkHover", { length: 191 }).notNull(),
	workMenu2Background: varchar("work_menu2_background", { length: 191 }).notNull(),
	workMenu2Text: varchar("work_menu2_text", { length: 191 }).notNull(),
	workMenu2Link: varchar("work_menu2_link", { length: 191 }).notNull(),
	workMenu2LinkHover: varchar("work_menu2_linkHover", { length: 191 }).notNull(),
	workMainBackground: varchar("work_main_background", { length: 191 }).notNull(),
	workMainText: varchar("work_main_text", { length: 191 }).notNull(),
	workMainLink: varchar("work_main_link", { length: 191 }).notNull(),
	workMainLinkHover: varchar("work_main_linkHover", { length: 191 }).notNull(),
	workFooterBackground: varchar("work_footer_background", { length: 191 }).notNull(),
	workFooterText: varchar("work_footer_text", { length: 191 }).notNull(),
	workFooterLink: varchar("work_footer_link", { length: 191 }).notNull(),
	workFooterLinkHover: varchar("work_footer_linkHover", { length: 191 }).notNull(),
	otherMenu1Background: varchar("other_menu1_background", { length: 191 }).notNull(),
	otherMenu1Text: varchar("other_menu1_text", { length: 191 }).notNull(),
	otherMenu1Link: varchar("other_menu1_link", { length: 191 }).notNull(),
	otherMenu1LinkHover: varchar("other_menu1_linkHover", { length: 191 }).notNull(),
	otherMenu2Background: varchar("other_menu2_background", { length: 191 }).notNull(),
	otherMenu2Text: varchar("other_menu2_text", { length: 191 }).notNull(),
	otherMenu2Link: varchar("other_menu2_link", { length: 191 }).notNull(),
	otherMenu2LinkHover: varchar("other_menu2_linkHover", { length: 191 }).notNull(),
	otherMainBackground: varchar("other_main_background", { length: 191 }).notNull(),
	otherMainText: varchar("other_main_text", { length: 191 }).notNull(),
	otherMainLink: varchar("other_main_link", { length: 191 }).notNull(),
	otherMainLinkHover: varchar("other_main_linkHover", { length: 191 }).notNull(),
	otherFooterBackground: varchar("other_footer_background", { length: 191 }).notNull(),
	otherFooterText: varchar("other_footer_text", { length: 191 }).notNull(),
	otherFooterLink: varchar("other_footer_link", { length: 191 }).notNull(),
	otherFooterLinkHover: varchar("other_footer_linkHover", { length: 191 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "Theme_id"}),
	unique("Theme_name_key").on(table.name),
]);

export const user = mysqlTable("User", {
	id: int().autoincrement().notNull(),
	email: varchar({ length: 191 }).notNull(),
	password: varchar({ length: 191 }).notNull(),
	isAdmin: tinyint().default(1).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "User_id"}),
	unique("User_email_key").on(table.email),
]);
