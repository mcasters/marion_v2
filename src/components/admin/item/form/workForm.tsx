"use client";

import React, { useActionState, useState } from "react";
import s from "@/components/admin/admin.module.css";
import { Category, Image, Type, Work } from "@/lib/type.ts";
import SubmitButton from "@/components/admin/common/button/submitButton.tsx";
import CancelButton from "@/components/admin/common/button/cancelButton.tsx";
import { createItem, updateItem } from "@/app/actions/item-post/admin.ts";
import ImageInput from "@/components/admin/common/image/imageInput.tsx";
import { format } from "date-fns/format";
import useActionResult from "@/components/hooks/useActionResult.ts";

interface Props {
  work: Work;
  onClose: () => void;
  categories?: Category[];
}

export default function WorkForm({ work, onClose, categories }: Props) {
  const isSculpture = work.type === Type.SCULPTURE;
  const [workItem, setWorkItem] = useState<Work>(work);
  const [state, action] = useActionState(
    work.id !== 0 ? updateItem : createItem,
    null,
  );
  useActionResult(state, onClose);

  return (
    <form action={action}>
      <input name="type" type="hidden" value={work.type} />
      <input name="id" type="hidden" value={work.id} />
      {work.categoryId !== workItem.categoryId && (
        <input
          name="oldCategoryId"
          type="hidden"
          value={String(work.categoryId)}
        />
      )}
      <div className={s.columnWrapper}>
        <div>
          <label>
            Titre *
            <input
              name="title"
              type="text"
              value={workItem.title}
              onChange={(e) =>
                setWorkItem({ ...workItem, title: e.target.value })
              }
              required
            />
          </label>
          <label>
            Date *
            <input
              name="date"
              type="date"
              value={format(new Date(workItem.date), "yyyy-MM-dd")}
              onChange={(e) =>
                setWorkItem({ ...workItem, date: new Date(e.target.value) })
              }
              required
            />
          </label>
          <div className={s.flexPart}>
            <label>
              Hauteur *
              <input
                name="height"
                type="number"
                placeholder="cm"
                value={workItem.height === 0 ? "" : workItem.height.toString()}
                onChange={(e) =>
                  setWorkItem({ ...workItem, height: Number(e.target.value) })
                }
                required
              />
            </label>
            <label>
              Largeur *
              <input
                name="width"
                type="number"
                placeholder="cm"
                value={workItem.width === 0 ? "" : workItem.width.toString()}
                onChange={(e) =>
                  setWorkItem({ ...workItem, width: Number(e.target.value) })
                }
                required
              />
            </label>
            {isSculpture && (
              <label>
                Profondeur *
                <input
                  name="length"
                  type="number"
                  placeholder="cm"
                  value={
                    workItem.length === 0 ? "" : workItem.length.toString()
                  }
                  onChange={(e) =>
                    setWorkItem({ ...workItem, length: Number(e.target.value) })
                  }
                  required
                />
              </label>
            )}
          </div>
          <label>
            Description
            <textarea
              name="description"
              value={workItem.description}
              onChange={(e) =>
                setWorkItem({ ...workItem, description: e.target.value })
              }
              rows={3}
            />
          </label>
        </div>
        <div>
          <label>
            Catégorie
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
          </label>
          <label>
            Technique *
            <input
              name="technique"
              type="text"
              value={workItem.technique}
              onChange={(e) =>
                setWorkItem({ ...workItem, technique: e.target.value })
              }
              required
            />
          </label>
          <div className={`${s.flexPart} ${s.withMarginTop}`}>
            <input
              id="isToSell"
              name="isToSell"
              type="checkbox"
              checked={workItem.isToSell}
              onChange={(e) => {
                const isToSell = e.target.checked;
                setWorkItem({
                  ...workItem,
                  isToSell,
                  sold: isToSell ? false : workItem.sold,
                });
              }}
            />
            <label htmlFor="isToSell" className="labelCheckbox">
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
                className={s.optionInput}
              />
            )}
          </div>
          <div className={s.flexPart}>
            <input
              id="sold"
              name="sold"
              type="checkbox"
              checked={workItem.sold}
              onChange={(e) => {
                const sold = e.target.checked;
                setWorkItem({
                  ...workItem,
                  sold,
                  isToSell: sold ? false : workItem.isToSell,
                });
              }}
            />
            <label htmlFor="sold" className="labelCheckbox">
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
                className={s.optionInput}
              />
            )}
          </div>
          <div className={s.flexPart}>
            <input
              id="isOut"
              name="isOut"
              type="checkbox"
              checked={workItem.isOut}
              onChange={(e) =>
                setWorkItem({ ...workItem, isOut: e.target.checked })
              }
            />
            <label htmlFor="isOut" className="labelCheckbox">
              Sortie
            </label>
            {workItem.isOut && (
              <textarea
                name="outInformation"
                placeholder="Information de sortie (facultatif)"
                value={workItem.outInformation}
                onChange={(e) =>
                  setWorkItem({ ...workItem, outInformation: e.target.value })
                }
                rows={2}
                className={s.optionInput}
              />
            )}
          </div>
        </div>
      </div>
      <ImageInput
        filesPath={workItem.images.map(
          (i: Image) => `/images/${work.type}/sm/${i.filename}`,
        )}
        isMultiple={isSculpture}
        smallImageOption={true}
        title={isSculpture ? "Images * :" : "Image * :"}
        required
      />
      <div className={s.buttonSection}>
        <SubmitButton />
        <CancelButton onCancel={onClose} />
      </div>
    </form>
  );
}
