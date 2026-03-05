import s from "@/components/admin/admin.module.css";
import React from "react";
import { getAdminPosts } from "@/app/actions/item-post/admin.ts";
import PostManagement from "@/components/admin/item/postManagement.tsx";

export default async function Posts() {
  const posts = await getAdminPosts();

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Les posts</h1>
      <PostManagement posts={posts} />
    </div>
  );
}
