"use client";

import React, { useState } from "react";
import s from "@/components/admin/admin.module.css";
import { Category, Image, Type, Work } from "@/lib/type.ts";
import { useAlert } from "@/app/context/alertProvider.tsx";
import SubmitButton from "@/components/admin/common/button/submitButton.tsx";
import CancelButton from "@/components/admin/common/button/cancelButton.tsx";
import { createItem, updateItem } from "@/app/actions/item-post/admin.ts";
import Preview from "@/components/admin/common/image/preview.tsx";
import ImageInput from "@/components/admin/common/image/imageInput.tsx";
import { format } from "date-fns/format";

interface Props {
  work: Work;
  onClose: () => void;
  categories?: Category[];
}

export default function WorkForm({ work, onClose, categories }: Props) {
  const isUpdate = work.id !== 0;
  const isSculpture = work.type === Type.SCULPTURE;
  const alert = useAlert();
  const [workItem, setWorkItem] = useState<Work>(work);
  const [date, setDate] = useState<string>(
    format(new Date(work.date), "yyyy-MM-dd"),
  );
  const [filenamesToDelete, setFilenamesToDelete] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const handleDeleteFile = (filename: string) => {
    const images = workItem.images.filter(
      (i: Image) => i.filename !== filename,
    );
    setWorkItem({ ...workItem, images });
    setFilenamesToDelete([...filenamesToDelete, filename]);
  };

  const handleNewFiles = (files: File[]) => {
    setNewFiles((prevState) =>
      isSculpture ? [...prevState, ...files] : files,
    );
    if (!isSculpture && workItem.images.length !== 0)
      handleDeleteFile(workItem.images[0].filename);
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
      <input name="type" type="hidden" value={work.type} />
      {isUpdate && (
        <>
          <input name="id" type="hidden" value={work.id} />
          <input
            name="filenamesToDelete"
            type="hidden"
            value={filenamesToDelete}
          />
          {work.categoryId !== workItem.categoryId && (
            <input
              name="oldCategoryId"
              type="hidden"
              value={String(work.categoryId)}
            />
          )}
        </>
      )}
      <div className={s.columnWrapper}>
        <div>
          <input
            name="title"
            type="text"
            placeholder="Titre"
            value={workItem.title}
            onChange={(e) =>
              setWorkItem({ ...workItem, title: e.target.value })
            }
            required
          />
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
          <textarea
            name="description"
            placeholder="Description (facultative)"
            value={workItem.description}
            onChange={(e) =>
              setWorkItem({ ...workItem, description: e.target.value })
            }
            rows={3}
          />
        </div>
        <div className={s.col2}>
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
            name="technique"
            type="text"
            placeholder="Technique"
            value={workItem.technique}
            onChange={(e) =>
              setWorkItem({ ...workItem, technique: e.target.value })
            }
            required
          />
          <div className={s.checkTextForm}>
            <label className="checkboxLabel">
              <input
                name="isToSell"
                type="checkbox"
                checked={workItem.isToSell}
                onChange={(e) => {
                  const isToSell = e.target.checked;
                  setWorkItem({
                    ...workItem,
                    isToSell,
                    sold: !isToSell,
                  });
                }}
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
          <div className={s.checkTextForm}>
            <label className="checkboxLabel">
              <input
                name="sold"
                type="checkbox"
                checked={workItem.sold}
                onChange={(e) => {
                  const sold = e.target.checked;
                  setWorkItem({
                    ...workItem,
                    sold,
                    isToSell: !sold,
                  });
                }}
              />
              Vendu
            </label>
            {workItem.sold && (
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
      </div>
      <Preview
        filenames={workItem.images.map((i: Image) => i.filename)}
        pathImage={`/images/${work.type}`}
        onDelete={handleDeleteFile}
        emptyInfo={
          newFiles.length === 0 && workItem.images.length === 0
            ? isSculpture
              ? "Une photo minimum à ajouter"
              : "1 photo à ajouter"
            : ""
        }
      />
      <ImageInput
        isMultiple={isSculpture}
        smallImageOption={true}
        onNewFiles={handleNewFiles}
        required
      />
      <div className={s.buttonSection}>
        <SubmitButton />
        <CancelButton onCancel={onClose} />
      </div>
    </form>
  );
}
