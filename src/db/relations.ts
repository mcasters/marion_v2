import { relations } from "drizzle-orm/relations";
import {
  categoryContent,
  content,
  contentImage,
  drawing,
  drawingCategory,
  message,
  painting,
  paintingCategory,
  post,
  postImage,
  sculpture,
  sculptureCategory,
  sculptureImage,
  user,
} from "./schema.ts";

export const contentImageRelations = relations(contentImage, ({ one }) => ({
  content: one(content, {
    fields: [contentImage.contentId],
    references: [content.id],
  }),
}));

export const contentRelations = relations(content, ({ many }) => ({
  contentImages: many(contentImage),
}));

export const drawingRelations = relations(drawing, ({ one }) => ({
  drawingCategory: one(drawingCategory, {
    fields: [drawing.categoryId],
    references: [drawingCategory.id],
  }),
}));

export const drawingCategoryRelations = relations(
  drawingCategory,
  ({ one, many }) => ({
    drawings: many(drawing),
    categoryContent: one(categoryContent, {
      fields: [drawingCategory.categoryContentId],
      references: [categoryContent.id],
    }),
  }),
);

export const categoryContentRelations = relations(
  categoryContent,
  ({ many }) => ({
    drawingCategories: many(drawingCategory),
    paintingCategories: many(paintingCategory),
    sculptureCategories: many(sculptureCategory),
  }),
);

export const messageRelations = relations(message, ({ one }) => ({
  user: one(user, {
    fields: [message.userId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  messages: many(message),
}));

export const paintingRelations = relations(painting, ({ one }) => ({
  paintingCategory: one(paintingCategory, {
    fields: [painting.categoryId],
    references: [paintingCategory.id],
  }),
}));

export const paintingCategoryRelations = relations(
  paintingCategory,
  ({ one, many }) => ({
    paintings: many(painting),
    categoryContent: one(categoryContent, {
      fields: [paintingCategory.categoryContentId],
      references: [categoryContent.id],
    }),
  }),
);

export const postImageRelations = relations(postImage, ({ one }) => ({
  post: one(post, {
    fields: [postImage.postId],
    references: [post.id],
  }),
}));

export const postRelations = relations(post, ({ many }) => ({
  postImages: many(postImage),
}));

export const sculptureRelations = relations(sculpture, ({ one, many }) => ({
  sculptureCategory: one(sculptureCategory, {
    fields: [sculpture.categoryId],
    references: [sculptureCategory.id],
  }),
  sculptureImages: many(sculptureImage),
}));

export const sculptureCategoryRelations = relations(
  sculptureCategory,
  ({ one, many }) => ({
    sculptures: many(sculpture),
    categoryContent: one(categoryContent, {
      fields: [sculptureCategory.categoryContentId],
      references: [categoryContent.id],
    }),
  }),
);

export const sculptureImageRelations = relations(sculptureImage, ({ one }) => ({
  sculpture: one(sculpture, {
    fields: [sculptureImage.sculptureId],
    references: [sculpture.id],
  }),
}));
