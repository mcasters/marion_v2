"use client";

import React, { useState } from "react";

import s from "@/components/admin/admin.module.css";
import SubmitButton from "@/components/admin/common/button/submitButton.tsx";
import CancelButton from "@/components/admin/common/button/cancelButton.tsx";
import { AdminCategory } from "@/lib/type.ts";
import { useAlert } from "@/app/context/alertProvider.tsx";
import SelectImageList from "@/components/admin/common/image/selectImageList.tsx";
import { MESSAGE } from "@/constants/admin.ts";
import {
  getCreateCategoryAction,
  getUpdateCategoryAction,
} from "@/lib/utils/actionUtils.ts";

interface Props {
  adminCategory: AdminCategory;
  onClose: () => void;
}
export default function CategoryForm({ adminCategory, onClose }: Props) {
  const isUpdate = adminCategory.id !== 0;
  const type = adminCategory.workType;
  const [workCategory, setWorkCategory] =
    useState<AdminCategory>(adminCategory);
  const [filename, setFilename] = useState<string>(adminCategory.imageFilename);
  const alert = useAlert();

  const submit = async (formData: FormData) => {
    const action = isUpdate
      ? getUpdateCategoryAction(type)
      : getCreateCategoryAction(type);
    const { message, isError } = await action(formData);
    if (!isError) onClose();
    alert(message, isError);
  };

  return (
    <form action={submit}>
      <input type="hidden" name="id" value={adminCategory.id} />
      <input type="hidden" name="type" value={adminCategory.workType} />
      <input type="hidden" name="filename" value={filename} />
      <label>
        Nom de la catégorie
        <input
          name="value"
          type="text"
          value={workCategory.value}
          onChange={(e) =>
            setWorkCategory({ ...workCategory, value: e.target.value })
          }
          required
        />
      </label>
      {!isUpdate && (
        <p>
          <small>{MESSAGE.categoryImage}</small>
        </p>
      )}
      <label>
        Titre (facultatif)
        <input
          name="title"
          type="text"
          value={workCategory.title}
          onChange={(e) =>
            setWorkCategory({ ...workCategory, title: e.target.value })
          }
        />
      </label>
      <label>
        Texte descriptif (facultatif)
        <textarea
          name="text"
          rows={5}
          value={workCategory.text}
          onChange={(e) =>
            setWorkCategory({ ...workCategory, text: e.target.value })
          }
        />
      </label>
      <SelectImageList
        filenames={adminCategory.filenames}
        selectedFilename={workCategory.imageFilename}
        onChange={(filename) => setFilename(filename)}
        type={adminCategory.workType}
      />
      <div className={s.buttonSection}>
        <SubmitButton />
        <CancelButton onCancel={onClose} />
      </div>
    </form>
  );
}
