"use client";

import React, { useState } from "react";
import { AdminPost, Image, Post, Type } from "@/lib/type.ts";
import s from "@/components/admin/admin.module.css";
import { useAlert } from "@/app/context/alertProvider.tsx";
import Preview from "@/components/admin/common/image/preview.tsx";
import { createItem, updateItem } from "@/app/actions/item-post/admin.ts";
import SubmitButton from "@/components/admin/common/button/submitButton.tsx";
import CancelButton from "@/components/admin/common/button/cancelButton.tsx";
import ImageInput from "@/components/admin/common/image/imageInput.tsx";

interface Props {
  post: AdminPost;
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
  const [newMainFile, setNewMainFile] = useState<File[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const handleDeleteFile = (filename: string) => {
    const images = workPost.images.filter(
      (i: Image) => i.filename !== filename,
    );
    setWorkPost({ ...workPost, images });
    setFilenamesToDelete([...filenamesToDelete, filename]);
  };

  const handleNewMainFile = (files: File[]) => {
    setNewMainFile([files[0]]);
    const mainFilename = workPost.images
      .filter((i: Image) => i.isMain)
      .map((i: Image) => i.filename)[0];
    if (mainFilename) {
      handleDeleteFile(mainFilename);
    }
  };

  const submit = async (formData: FormData) => {
    formData.append("mainFile", newMainFile[0]);
    newFiles.forEach((file) => formData.append("files", file));
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
        onDelete={(filename) => handleDeleteFile(filename)}
        title="Image principale - une seule image (facultative)"
      />
      <ImageInput
        isMultiple={false}
        smallImageOption={true}
        onNewFiles={handleNewMainFile}
      />
      <Preview
        filenames={workPost.images
          .filter((i: Image) => !i.isMain)
          .map((i: Image) => i.filename)}
        pathImage={`/images/${Type.POST}`}
        onDelete={(filename) => handleDeleteFile(filename)}
        title="Album d'images (facultatif)"
        style={{ marginTop: "20px" }}
      />
      <ImageInput
        isMultiple={true}
        smallImageOption={true}
        onNewFiles={(files) =>
          setNewFiles((prevState) => [...prevState, ...files])
        }
      />
      <div className={s.buttonSection}>
        <SubmitButton disabled={!workPost.title || !date} />
        <CancelButton onCancel={onClose} />
      </div>
    </form>
  );
}
