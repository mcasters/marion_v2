"use client";

import React, { useEffect, useState } from "react";
import s from "@/components/admin/admin.module.css";
import { Category, Image, Type, Work } from "@/lib/type";
import { useAlert } from "@/app/context/alertProvider";
import SubmitButton from "@/components/admin/form/submitButton";
import CancelButton from "@/components/admin/form/cancelButton";
import { createItem, updateItem } from "@/app/actions/item-post/admin";
import Preview from "@/components/admin/form/image/preview.tsx";
import ImageInput from "@/components/admin/form/image/imageInput.tsx";
import { format } from "date-fns/format";

interface Props {
  item: Work;
  onClose: () => void;
  categories?: Category[];
}

export default function WorkForm({ item, onClose, categories }: Props) {
  const isUpdate = item.id !== 0;
  const isSculpture = item.type === Type.SCULPTURE;
  const alert = useAlert();
  const [workItem, setWorkItem] = useState<Work>(item);
  const [date, setDate] = useState<string>(
    format(new Date(item.date), "yyyy-MM-dd"),
  );
  const [filenamesToDelete, setFilenamesToDelete] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!isSculpture && workItem.images.length > 0 && newFiles.length > 0) {
      handleDeleteFile(workItem.images[0].filename);
    }
  }, [newFiles]);

  const handleDeleteFile = (filename: string) => {
    const images = workItem.images.filter(
      (i: Image) => i.filename !== filename,
    );
    setWorkItem({ ...workItem, images });
    setFilenamesToDelete([...filenamesToDelete, filename]);
  };

  const submit = async (formData: FormData) => {
    newFiles.forEach((file) => formData.append("files", file));
    const action = isUpdate ? updateItem : createItem;
    const { message, isError } = await action(formData);
    if (!isError) onClose();
    alert(message, isError);
  };

  return (
    <form action={submit}>
      <input name="type" type="hidden" value={item.type} />
      {isUpdate && (
        <>
          <input name="id" type="hidden" value={item.id} />
          <input
            name="filenamesToDelete"
            type="hidden"
            value={filenamesToDelete}
          />
        </>
      )}
      <input name="isToSell" type="hidden" value={String(item.isToSell)} />
      <input
        name="oldCategoryId"
        type="hidden"
        value={String(item.categoryId)}
      />
      <div className={s.column}>
        <input
          name="title"
          type="text"
          placeholder="Titre"
          value={workItem.title}
          onChange={(e) => setWorkItem({ ...workItem, title: e.target.value })}
          autoFocus
          required
        />
        <select
          name="categoryId"
          value={workItem.categoryId?.toString()}
          onChange={(e) => {
            setWorkItem(
              Object.assign({}, workItem, {
                categoryId: e.target.value,
              }),
            );
          }}
        >
          <option value={0}>-- Aucune catégorie --</option>
          {categories &&
            categories.map((cat) => {
              if (cat.value !== "Sans catégorie")
                return (
                  <option key={cat.id} value={cat.id}>
                    {cat.value}
                  </option>
                );
            })}
        </select>
        <input
          name="date"
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
          }}
          required
        />
        <input
          name="technique"
          type="text"
          placeholder="Technique"
          value={workItem.technique}
          onChange={(e) =>
            setWorkItem({ ...workItem, technique: e.target.value })
          }
          required
        />
        <div className={s.dimensions}>
          <input
            name="height"
            type="number"
            placeholder="Hauteur (cm)"
            value={workItem.height === 0 ? "" : workItem.height.toString()}
            onChange={(e) =>
              setWorkItem({ ...workItem, height: Number(e.target.value) })
            }
            required
          />
          <input
            name="width"
            type="number"
            placeholder="Largeur (cm)"
            value={workItem.width === 0 ? "" : workItem.width.toString()}
            onChange={(e) =>
              setWorkItem({ ...workItem, width: Number(e.target.value) })
            }
            required
          />
          {isSculpture && (
            <input
              name="length"
              type="number"
              placeholder="Profondeur (cm)"
              value={workItem.length === 0 ? "" : workItem.length.toString()}
              onChange={(e) =>
                setWorkItem({ ...workItem, length: Number(e.target.value) })
              }
              required
            />
          )}
        </div>
        <div className={s.checkTextForm}>
          <label className="checkboxLabel">
            <input
              name="isToSell"
              type="checkbox"
              checked={workItem.isToSell}
              onChange={(e) =>
                setWorkItem({ ...workItem, isToSell: e.target.checked })
              }
            />
            À vendre
          </label>
          {workItem.isToSell && (
            <input
              name="price"
              type="number"
              placeholder="Prix (facultatif)"
              value={
                !workItem.price || workItem.price === 0
                  ? ""
                  : workItem.price.toString()
              }
              onChange={(e) =>
                setWorkItem({ ...workItem, price: Number(e.target.value) })
              }
            />
          )}
        </div>
        <textarea
          name="description"
          placeholder="Description (facultative)"
          value={workItem.description}
          onChange={(e) =>
            setWorkItem({ ...workItem, description: e.target.value })
          }
          rows={3}
        />
        <div className={s.checkTextForm}>
          <label className="checkboxLabel">
            <input
              name="isOut"
              type="checkbox"
              checked={workItem.isOut}
              onChange={(e) =>
                setWorkItem({ ...workItem, isOut: e.target.checked })
              }
            />
            Sortie
          </label>
          {workItem.isOut && (
            <textarea
              name="outInformation"
              placeholder="Information de sortie (facultative)"
              value={workItem.outInformation}
              onChange={(e) =>
                setWorkItem({ ...workItem, outInformation: e.target.value })
              }
              rows={3}
            />
          )}
        </div>
      </div>
      <Preview
        filenames={workItem.images.map((i: Image) => i.filename)}
        pathImage={`/images/${item.type}`}
        onDelete={handleDeleteFile}
        title={isSculpture ? "Une photo minimum :" : "Une seule photo :"}
      />
      <ImageInput
        isMultiple={isSculpture}
        acceptSmallImage={true}
        onNewFiles={setNewFiles}
      />
      <div className={s.buttonSection}>
        <SubmitButton
          disabled={
            workItem.title === "" ||
            workItem.technique === "" ||
            date === "" ||
            workItem.height === 0 ||
            workItem.width === 0 ||
            (isSculpture && workItem.length === 0) ||
            (newFiles.length === 0 && workItem.images.length === 0)
          }
        />
        <CancelButton onCancel={onClose} />
      </div>
    </form>
  );
}
