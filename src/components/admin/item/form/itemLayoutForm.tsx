"use client";

import React, { useState } from "react";
import s from "@/components/admin/admin.module.css";
import { useAlert } from "@/app/context/alertProvider.tsx";
import { updateMeta } from "@/app/actions/meta/admin.ts";
import { Type } from "@/lib/type.ts";
import Image from "next/image";
import { getWorkLayout } from "@/lib/utils/commonUtils.ts";
import { useMetas } from "@/app/context/metaProvider.tsx";

type Props = {
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING;
};

export default function ItemLayoutForm({ type }: Props) {
  const metas = useMetas();
  const alert = useAlert();
  const [itemLayout, itemDarkBackground] = getWorkLayout(metas, type);
  const [layout, setLayout] = useState<string>(itemLayout.toString());
  const [darkBackground, setDarkBackground] = useState<boolean>(
    itemDarkBackground === 1,
  );

  const submit = async (formData: FormData) => {
    const { message, isError } = await updateMeta(null, formData);
    alert(message, isError);
  };

  return (
    <form action={submit} className={s.layoutForm}>
      <input
        type="hidden"
        name="label"
        value={
          type === Type.PAINTING
            ? "paintingLayout"
            : type === Type.SCULPTURE
              ? "sculptureLayout"
              : "drawingLayout"
        }
      />
      <input type="hidden" name="layout" value={layout} />
      <input
        type="hidden"
        name="darkBackground"
        value={darkBackground ? "1" : "0"}
      />
      {(type === Type.PAINTING || type === Type.DRAWING) && (
        <>
          <label className={s.layoutLabel}>
            <button
              onClick={() => setLayout("0")}
              className={
                layout === "0"
                  ? `${s.buttonLayoutSelected} ${s.buttonLayout}`
                  : s.buttonLayout
              }
            >
              <Image
                src="/assets/mono-layout.png"
                alt=""
                width={200}
                height={130}
                unoptimized
              />
            </button>
            <p>
              <strong>{`Une seule image dans la largeur :`}</strong>
              <br />
              {`Les œuvres se suivent, l'image est plus grande, et la description est à côté.`}
            </p>
          </label>
          <label className={s.layoutLabel}>
            <button
              onClick={() => setLayout("1")}
              className={
                layout === "1"
                  ? `${s.buttonLayoutSelected} ${s.buttonLayout}`
                  : s.buttonLayout
              }
            >
              <Image
                src="/assets/double-layout.png"
                alt=""
                width={200}
                height={130}
                unoptimized
              />
            </button>
            <p>
              <strong>{`Deux images dans la largeur :`}</strong>
              <br />
              {`Les œuvres sont individualisées, leur description est en
                dessous.`}
            </p>
          </label>
        </>
      )}
      {type === Type.SCULPTURE && (
        <label className={s.layoutLabel}>
          <button
            onClick={() => setLayout("3")}
            className={
              layout === "3"
                ? `${s.buttonLayoutSelected} ${s.buttonLayout}`
                : s.buttonLayout
            }
          >
            <Image
              src="/assets/sculpture-layout.png"
              alt=""
              width={200}
              height={130}
              unoptimized
            />
          </button>
          <p>
            <strong>{`Images de la sculpture groupées :`}</strong>
            <br />
            {`Les sculptures sont individualisées, leur description est en
              dessous. Les images d'une même œuvre étant groupées ensemble, il est plus joli qu'elles aient toutes le même ratio (rapport largeur/hauteur)`}
          </p>
        </label>
      )}
      <label className={s.layoutLabel}>
        <button
          onClick={() => setLayout("2")}
          className={
            layout === "2"
              ? `${s.buttonLayoutSelected} ${s.buttonLayout}`
              : s.buttonLayout
          }
        >
          <Image
            src="/assets/gallery-layout.png"
            alt=""
            width={200}
            height={130}
            unoptimized
          />
        </button>
        <p>
          <strong>{`Galerie : toutes les images s'imbriquent :`}</strong>
          <br />
          {`Vision d'ensemble, toutes les œuvres sont ensembles, et leur description n'apparait que lorsqu'on ouvre la "lightbox" (lorsqu'on clic sur l'image et qu'elle s'affiche en grand sur fond noir).`}
        </p>
      </label>
      <br />
      <br />
      <label>
        <button
          onClick={() => setDarkBackground(!darkBackground)}
          className={
            darkBackground
              ? `${s.buttonLayoutSelected} ${s.buttonDarkBackground}`
              : `${s.buttonDarkBackground}`
          }
        />
        <strong>Zone plus foncée derrière les œuvres</strong>
      </label>
    </form>
  );
}
