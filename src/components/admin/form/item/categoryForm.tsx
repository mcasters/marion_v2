"use client";

import React, { useState } from "react";

import s from "@/components/admin/admin.module.css";
import SubmitButton from "@/components/admin/form/submitButton";
import CancelButton from "@/components/admin/form/cancelButton";
import { Category, CategoryFull, Image } from "@/lib/type";
import { useAlert } from "@/app/context/alertProvider";
import SelectImageList from "@/components/admin/form/image/selectImageList";

import {
  createCategory,
  updateCategory,
} from "@/app/actions/item-post/categories/admin";
import { MESSAGE } from "@/constants/admin.ts";

interface Props {
  category: CategoryFull;
  onClose: () => void;
}
export default function CategoryForm({ category, onClose }: Props) {
  const isUpdate = category.id !== 0;
  const [workCategory, setWorkCategory] = useState<Category>(category);
  const [image, setImage] = useState<Image>(category.content.image);
  const alert = useAlert();

  const submit = async (formData: FormData) => {
    const action = isUpdate ? updateCategory : createCategory;
    const { message, isError } = await action(null, formData);
    if (!isError) onClose();
    alert(message, isError);
  };

  return (
    <form action={submit}>
      <input type="hidden" name="id" value={category.id} />
      <input type="hidden" name="type" value={category.workType} />
      <input type="hidden" name="filename" value={image.filename} />
      <input type="hidden" name="width" value={image.width} />
      <input type="hidden" name="height" value={image.height} />
      <input
        name="value"
        type="text"
        value={workCategory.value}
        onChange={(e) =>
          setWorkCategory({ ...workCategory, value: e.target.value })
        }
        required
        placeholder="Nom de la catégorie"
        autoFocus
      />
      {!isUpdate && (
        <p>
          <small>{MESSAGE.categoryImage}</small>
        </p>
      )}
      <br />
      <input
        name="title"
        type="text"
        value={workCategory.content.title}
        onChange={(e) =>
          setWorkCategory({
            ...workCategory,
            content: { ...workCategory.content, title: e.target.value },
          })
        }
        placeholder="Titre du descriptif (facultatif)"
      />
      <br />
      <textarea
        name="text"
        rows={5}
        value={workCategory.content.text}
        onChange={(e) =>
          setWorkCategory({
            ...workCategory,
            content: { ...workCategory.content, text: e.target.value },
          })
        }
        placeholder="Texte descriptif (facultatif)"
      />
      <br />
      {isUpdate && (
        <SelectImageList
          itemsImages={category.images}
          selectedImage={workCategory.content.image}
          onChange={(image) => setImage(image)}
          type={category.workType}
        />
      )}
      <div className={s.buttonSection}>
        <SubmitButton />
        <CancelButton onCancel={onClose} />
      </div>
    </form>
  );
}
