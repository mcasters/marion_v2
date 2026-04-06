"use client";

import React, { useActionState, useState } from "react";
import { Image, Post } from "@/lib/type.ts";
import s from "@/components/admin/admin.module.css";
import SubmitButton from "@/components/admin/common/button/submitButton.tsx";
import CancelButton from "@/components/admin/common/button/cancelButton.tsx";
import ImageInput from "@/components/admin/common/image/imageInput.tsx";
import useActionResult from "@/components/hooks/useActionResult.ts";
import { getCreateAction, getUpdateAction } from "@/lib/utils/actionUtils.ts";
import { TYPE } from "@/db/schema.ts";

interface Props {
  post: Post;
  onClose: () => void;
}

export default function PostForm({ post, onClose }: Props) {
  const [workPost, setWorkPost] = useState<Post>(post);
  const [state, action] = useActionState(
    post.id !== 0 ? getUpdateAction(TYPE.POST) : getCreateAction(TYPE.POST),
    null,
  );
  useActionResult(state, onClose);

  return (
    <form action={action}>
      <input type="hidden" name="type" value={TYPE.POST} />
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
        key="main"
        filesPath={workPost.images
          .filter((i) => i.isMain)
          .map((i: Image) => `/images/${TYPE.POST}/sm/${i.filename}`)}
        smallImageOption={true}
        title="Image principale - une seule image (facultative)"
        isMain={true}
      />
      <ImageInput
        key="album"
        filesPath={workPost.images
          .filter((i) => !i.isMain)
          .map((i: Image) => `/images/${TYPE.POST}/sm/${i.filename}`)}
        isMultiple={true}
        smallImageOption={true}
        isMain={false}
        title="Album d'images (facultatif)"
      />
      <div className={s.buttonSection}>
        <SubmitButton />
        <CancelButton onCancel={onClose} />
      </div>
    </form>
  );
}
