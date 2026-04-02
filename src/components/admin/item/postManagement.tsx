"use client";

import s from "@/components/admin/admin.module.css";
import React from "react";
import { Post } from "@/lib/type.ts";
import AddButton from "@/components/admin/common/button/addButton.tsx";
import { getEmptyPost, getThumbnailSrc } from "@/lib/utils/commonUtils.ts";
import SelectableList from "@/components/admin/common/selectableList/selectableList.tsx";
import SelectableListRow from "@/components/admin/common/selectableList/selectableListRow.tsx";
import PostForm from "@/components/admin/item/form/postForm.tsx";
import { getDeleteAction } from "@/lib/utils/actionUtils.ts";
import { TYPE } from "@/db/schema.ts";

interface Props {
  posts: Post[];
}
export default function PostManagement({ posts }: Props) {
  const deleteAction = getDeleteAction(TYPE.POST);
  return (
    <>
      <h2 className={s.title2}>Liste des posts</h2>
      <SelectableList
        items={posts}
        renderItem={(post) => (
          <SelectableListRow
            part1={post.title}
            part2={new Date(post.date).getFullYear().toString()}
            imageSrc={getThumbnailSrc(post)}
            deleteAction={() => deleteAction(post.id)}
          />
        )}
        formToRender={(post, handleClose) => (
          <PostForm post={post} onClose={handleClose} />
        )}
      />
      <AddButton
        renderForm={(toggle) => (
          <PostForm post={getEmptyPost()} onClose={toggle} />
        )}
        modalWidth={900}
      />
    </>
  );
}
