"use client";

import React, { useActionState, useState } from "react";
import s from "@/components/admin/admin.module.css";
import Image from "next/image";
import { getWorkLayout } from "@/lib/utils/commonUtils.ts";
import { useMetaContext } from "@/app/context/metaProvider.tsx";
import useActionResult from "@/components/hooks/useActionResult.ts";
import { TYPE } from "@/db/schema.ts";
import { updateMeta } from "@/app/admin/meta/action.ts";

type Props = {
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING;
};

export default function ItemLayoutForm({ type }: Props) {
  const metas = useMetaContext();
  const [itemLayout, itemDarkBackground] = getWorkLayout(metas, type);
  const [layout, setLayout] = useState<string>(itemLayout.toString());
  const [darkBackground, setDarkBackground] = useState<boolean>(
    itemDarkBackground === 1,
  );
  const [state, action] = useActionState(updateMeta, null);
  useActionResult(state);

  return (
    <form action={action} className={s.layoutForm}>
      <input
        type="hidden"
        name="key"
        value={
          type === TYPE.PAINTING
            ? "paintingLayout"
            : type === TYPE.SCULPTURE
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
      {(type === TYPE.PAINTING || type === TYPE.DRAWING) && (
        <>
          <p className={s.layoutLabel}>
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
            <span>
              <strong>{`Une seule image dans la largeur :`}</strong>
              <br />
              {`Les œuvres se suivent, l'image est plus grande, et la description est à côté.`}
            </span>
          </p>
          <p className={s.layoutLabel}>
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
            <span>
              <strong>{`Deux images dans la largeur :`}</strong>
              <br />
              {`Les œuvres sont individualisées, leur description est en
                dessous.`}
            </span>
          </p>
        </>
      )}
      {type === TYPE.SCULPTURE && (
        <p className={s.layoutLabel}>
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
          <span>
            <strong>{`Images de la sculpture groupées :`}</strong>
            <br />
            {`Les sculptures sont individualisées, leur description est en
              dessous. Les images d'une même œuvre étant groupées ensemble, il est plus joli qu'elles aient toutes le même ratio (rapport largeur/hauteur)`}
          </span>
        </p>
      )}
      <p className={s.layoutLabel}>
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
        <span>
          <strong>{`Galerie : toutes les images s'imbriquent :`}</strong>
          <br />
          {`Vision d'ensemble, toutes les œuvres sont ensembles, et leur description n'apparait que lorsqu'on ouvre la "lightbox" (lorsqu'on clic sur l'image et qu'elle s'affiche en grand sur fond noir).`}
        </span>
      </p>
      <br />
      <br />
      <p className={s.layoutLabel}>
        <button
          onClick={() => setDarkBackground(!darkBackground)}
          className={
            darkBackground
              ? `${s.buttonLayoutSelected} ${s.buttonDarkBackground}`
              : `${s.buttonDarkBackground}`
          }
        />
        <strong>Zone plus foncée derrière les œuvres</strong>
      </p>
    </form>
  );
}
