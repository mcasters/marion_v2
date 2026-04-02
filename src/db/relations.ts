import * as schema from "./schema";
import { defineRelations } from "drizzle-orm";

export const relations = defineRelations(schema, (r) => ({
  content: {
    images: r.many.contentImage({
      from: r.content.id,
      to: r.contentImage.contentId,
    }),
  },
  drawingCategory: {
    drawings: r.many.drawing({
      from: r.drawingCategory.id,
      to: r.drawing.categoryId,
    }),
  },
  user: {
    messages: r.many.message({
      from: r.user.id,
      to: r.message.userId,
    }),
  },
  paintingCategory: {
    paintings: r.many.painting({
      from: r.paintingCategory.id,
      to: r.painting.categoryId,
    }),
  },
  postImage: {
    post: r.one.post({
      from: r.postImage.postId,
      to: r.post.id,
    }),
  },
  post: {
    images: r.many.postImage({
      from: r.post.id,
      to: r.postImage.postId,
    }),
  },
  sculpture: {
    images: r.many.sculptureImage({
      from: r.sculpture.id,
      to: r.sculptureImage.sculptureId,
    }),
  },
  sculptureCategory: {
    sculptures: r.many.sculpture({
      from: r.sculptureCategory.id,
      to: r.sculpture.categoryId,
    }),
  },
}));
