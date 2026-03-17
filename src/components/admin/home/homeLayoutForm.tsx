"use client";

import React, { useState } from "react";
import s from "@/components/admin/admin.module.css";
import { useAlert } from "@/app/context/alertProvider.tsx";
import Image from "next/image";
import { useMetas } from "@/app/context/metaProvider.tsx";
import { getHomeLayout } from "@/lib/utils/commonUtils.ts";
import { updateMeta } from "@/app/actions/meta";

export default function HomeLayoutForm() {
  const metas = useMetas();
  const alert = useAlert();
  const [value, setValue] = useState<string>(getHomeLayout(metas).toString());

  const submit = async (formData: FormData) => {
    const { message, isError } = await updateMeta(formData);
    alert(message, isError);
  };

  return (
    <form action={submit} className={s.layoutForm}>
      <input type="hidden" name="label" value={"homeLayout"} />
      <input type="hidden" name="text" value={value} />

      <p className={s.layoutLabel}>
        <button
          onClick={(e) => setValue(e.currentTarget.value)}
          className={
            value === "1"
              ? `${s.buttonLayoutSelected} ${s.buttonLayout}`
              : s.buttonLayout
          }
          value="1"
        >
          <Image
            src="/assets/home-nav-layout.png"
            alt=""
            width={200}
            height={130}
            unoptimized
          />
        </button>
        <span>
          <strong>{`Texte séparé :`}</strong>
          <br />
          {`Le titre du site, les menus, et l'introduction sont situés au dessus de l'image.`}
        </span>
      </p>
      <p className={s.layoutLabel}>
        <button
          onClick={(e) => setValue(e.currentTarget.value)}
          className={
            value === "0"
              ? `${s.buttonLayoutSelected} ${s.buttonLayout}`
              : s.buttonLayout
          }
          value="0"
        >
          <Image
            src="/assets/home-plain-layout.png"
            alt=""
            width={200}
            height={130}
            unoptimized
          />
        </button>
        <span>
          <strong>{`Texte intégré :`}</strong>
          <br />
          {`Le titre du site, les menus, et l'introduction sont situés sur l'image qui prend tout l'écran. Leur couleur doit alors être accordée avec l'image pour qu'ils restent lisibles : Mettre une seule image est sans doute plus simple.`}
        </span>
      </p>
    </form>
  );
}
