"use client";

import React, { useActionState, useState } from "react";
import { AdminPost, Image, Post, Type } from "@/lib/type.ts";
import s from "@/components/admin/admin.module.css";
import { createItem, updateItem } from "@/app/actions/item-post/admin.ts";
import SubmitButton from "@/components/admin/common/button/submitButton.tsx";
import CancelButton from "@/components/admin/common/button/cancelButton.tsx";
import ImageInput from "@/components/admin/common/image/imageInput.tsx";
import useActionResult from "@/components/hooks/useActionResult.ts";

interface Props {
  post: AdminPost;
  onClose: () => void;
}

export default function PostForm({ post, onClose }: Props) {
  const [workPost, setWorkPost] = useState<Post>(post);
  const [state, action] = useActionState(
    post.id !== 0 ? updateItem : createItem,
    null,
  );
  useActionResult(state, onClose);

  return (
    <form action={action}>
      <input type="hidden" name="type" value={Type.POST} />
      <input name="id" type="hidden" value={post.id} />
      <input
        onChange={(e) => setWorkPost({ ...workPost, title: e.target.value })}
        name="title"
        type="text"
        value={workPost.title}
        placeholder="Titre"
        required
      />
      <br />
      <input
        name="date"
        type="number"
        min={1980}
        max={2100}
        value={new Date(workPost.date).getFullYear().toString()}
        onChange={(e) =>
          setWorkPost({ ...workPost, date: new Date(e.target.value) })
        }
        required
      />
      <br />
      <textarea
        onChange={(e) => setWorkPost({ ...workPost, text: e.target.value })}
        name="text"
        rows={7}
        value={workPost.text}
        placeholder="Texte (facultatif)"
      />
      <ImageInput
        filesPath={workPost.images
          .filter((i) => i.isMain)
          .map((i: Image) => `/images/${Type.POST}/sm/${i.filename}`)}
        smallImageOption={true}
        title="Image principale - une seule image (facultative)"
        isMain={true}
      />
      <ImageInput
        filesPath={workPost.images
          .filter((i) => !i.isMain)
          .map((i: Image) => `/images/${Type.POST}/sm/${i.filename}`)}
        isMultiple={true}
        smallImageOption={true}
        title="Album d'images (facultatif)"
      />
      <div className={s.buttonSection}>
        <SubmitButton />
        <CancelButton onCancel={onClose} />
      </div>
    </form>
  );
}
