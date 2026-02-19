"use client";

import React, { useEffect, useState } from "react";
import { Image, Post, Type } from "@/lib/type";
import s from "@/components/admin/admin.module.css";
import { useAlert } from "@/app/context/alertProvider";
import Preview from "@/components/admin/form/image/preview.tsx";
import { createItem, updateItem } from "@/app/actions/item-post/admin";
import SubmitButton from "@/components/admin/form/submitButton";
import CancelButton from "@/components/admin/form/cancelButton";
import ImageInput from "@/components/admin/form/image/imageInput.tsx";

interface Props {
  post: Post;
  onClose: () => void;
}

export default function PostForm({ post, onClose }: Props) {
  const isUpdate = post.id !== 0;
  const alert = useAlert();

  const [workPost, setWorkPost] = useState<Post>(post);
  const [date, setDate] = useState<string>(
    new Date(post.date).getFullYear().toString(),
  );
  const [filenamesToDelete, setFilenamesToDelete] = useState<string[]>([]);
  const [resizedMainFiles, setResizedMainFiles] = useState<File[]>([]);
  const [resizedFiles, setResizedFiles] = useState<File[]>([]);

  useEffect(() => {
    const mainFilename = workPost.images
      .filter((i: Image) => i.isMain)
      .map((i: Image) => i.filename)[0];
    if (mainFilename && resizedMainFiles.length > 0) {
      handleDelete(mainFilename);
    }
  }, [resizedMainFiles]);

  const handleDelete = (filename: string) => {
    const images = workPost.images.filter(
      (i: Image) => i.filename !== filename,
    );
    setWorkPost({ ...workPost, images });
    setFilenamesToDelete([...filenamesToDelete, filename]);
  };

  const submit = async (formData: FormData) => {
    formData.append("mainFile", resizedMainFiles[0]);
    resizedFiles.forEach((file) => formData.append("files", file));
    const action = isUpdate ? updateItem : createItem;
    const { message, isError } = await action(formData);
    if (!isError) onClose();
    alert(message, isError);
  };

  return (
    <form action={submit}>
      <input type="hidden" name="type" value={Type.POST} />
      {isUpdate && (
        <>
          <input type="hidden" name="id" value={post.id} />
          <input
            type="hidden"
            name="filenamesToDelete"
            value={filenamesToDelete}
          />
        </>
      )}
      <input
        onChange={(e) => setWorkPost({ ...workPost, title: e.target.value })}
        name="title"
        type="text"
        value={workPost.title}
        required
        placeholder="Titre"
        autoFocus
      />
      <br />
      <input
        onChange={(e) => {
          setDate(e.target.value);
        }}
        name="date"
        type="number"
        min={1980}
        max={2100}
        value={date}
        required
        placeholder="Date"
      />
      <br />
      <textarea
        onChange={(e) => setWorkPost({ ...workPost, text: e.target.value })}
        name="text"
        rows={7}
        value={workPost.text}
        placeholder="Texte (facultatif)"
      />
      <Preview
        filenames={workPost.images
          .filter((i: Image) => i.isMain)
          .map((i: Image) => i.filename)}
        pathImage={`/images/${Type.POST}`}
        onDelete={(filename) => handleDelete(filename)}
        title="Image principale (facultative)"
      />
      <ImageInput
        isMultiple={false}
        acceptSmallImage={true}
        onNewFiles={setResizedMainFiles}
      />
      <Preview
        filenames={workPost.images
          .filter((i: Image) => !i.isMain)
          .map((i: Image) => i.filename)}
        pathImage={`/images/${Type.POST}`}
        onDelete={(filename) => handleDelete(filename)}
        title="Album d'images (facultatif)"
      />
      <ImageInput
        isMultiple={true}
        acceptSmallImage={true}
        onNewFiles={setResizedFiles}
      />
      <div className={s.buttonSection}>
        <SubmitButton disabled={!workPost.title || !date} />
        <CancelButton onCancel={onClose} />
      </div>
    </form>
  );
}
