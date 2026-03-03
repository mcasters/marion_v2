import s from "@/components/admin/admin.module.css";
import React from "react";
import { getEmptyPost } from "@/lib/utils/commonUtils";
import AddButton from "@/components/admin/form/addButton.tsx";
import ListComponent from "@/components/admin/form/item/listComponent";
import { getAdminPosts } from "@/app/actions/item-post/admin.ts";

export default async function Posts() {
  const posts = await getAdminPosts();

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Les posts</h1>
      <h2 className={s.title2}>Liste des posts</h2>
      <ListComponent items={posts} />
      <AddButton item={getEmptyPost()} />
    </div>
  );
}
