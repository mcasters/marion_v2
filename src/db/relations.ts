import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  content: {
    images: r.many.contentImage(),
  },
  contentImage: {
    content: r.one.content({
      from: r.contentImage.contentId,
      to: r.content.id,
    }),
  },
  drawing: {
    category: r.one.drawingCategory({
      from: r.drawing.categoryId,
      to: r.drawingCategory.id,
    }),
  },
  drawingCategory: {
    drawings: r.many.drawing(),
  },
  user: {
    messages: r.many.message(),
  },
  message: {
    author: r.one.user({
      from: r.message.userId,
      to: r.user.id,
    }),
  },
  painting: {
    category: r.one.paintingCategory({
      from: r.painting.categoryId,
      to: r.paintingCategory.id,
    }),
  },
  paintingCategory: {
    paintings: r.many.painting(),
  },
  post: {
    images: r.many.postImage(),
  },
  postImage: {
    post: r.one.post({
      from: r.postImage.postId,
      to: r.post.id,
    }),
  },
  sculpture: {
    images: r.many.sculptureImage(),
    category: r.one.sculptureCategory({
      from: r.sculpture.categoryId,
      to: r.sculptureCategory.id,
    }),
  },
  sculptureImage: {
    sculpture: r.one.sculpture({
      from: r.sculptureImage.sculptureId,
      to: r.sculpture.id,
    }),
  },
  sculptureCategory: {
    sculptures: r.many.sculpture(),
  },
}));
