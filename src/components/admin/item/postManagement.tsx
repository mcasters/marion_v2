"use client";

import s from "@/components/admin/admin.module.css";
import React from "react";
import { AdminPost, Type } from "@/lib/type.ts";
import AddButton from "@/components/admin/common/button/addButton.tsx";
import { getEmptyPost, getThumbnailSrc } from "@/lib/utils/commonUtils.ts";
import { deleteItem } from "@/app/actions/item-post/admin.ts";
import SelectableList from "@/components/admin/common/selectableList/selectableList.tsx";
import SelectableListRow from "@/components/admin/common/selectableList/selectableListRow.tsx";
import PostForm from "@/components/admin/item/form/postForm.tsx";

interface Props {
  posts: AdminPost[];
}
export default function PostManagement({ posts }: Props) {
  return (
    <>
      <h2 className={s.title2}>Liste des posts</h2>
      <SelectableList
        items={posts}
        renderItem={(post) => (
          <SelectableListRow
            item={post}
            part1={post.title}
            part2={new Date(post.date).getFullYear().toString()}
            imageSrc={getThumbnailSrc(post)}
            deleteAction={() => deleteItem(post.id, Type.POST)}
          />
        )}
        updateForm={(post, handleClose) => (
          <PostForm post={post} onClose={handleClose} />
        )}
      />
      <AddButton
        renderForm={(toggle) => (
          <PostForm post={getEmptyPost()} onClose={toggle} />
        )}
      />
    </>
  );
}
