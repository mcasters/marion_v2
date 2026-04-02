import s from "@/components/admin/admin.module.css";
import React from "react";
import PostManagement from "@/components/admin/item/postManagement.tsx";
import { getPosts } from "@/app/admin/posts/action.ts";

export default async function Posts() {
  const posts = await getPosts();

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Les posts</h1>
      <PostManagement posts={posts} />
    </div>
  );
}
