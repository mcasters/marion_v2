"use client";

import React, { useActionState, useState } from "react";
import s from "@/components/admin/admin.module.css";
import Image from "next/image";
import { useMetas } from "@/app/context/metaProvider.tsx";
import { getHomeLayout } from "@/lib/utils/commonUtils.ts";
import { KEY_META } from "@/constants/admin.ts";
import useActionResult from "@/components/hooks/useActionResult.ts";
import { updateMeta } from "@/app/admin/meta/action.ts";

export default function HomeLayoutForm() {
  const metas = useMetas();
  const [value, setValue] = useState<string>(getHomeLayout(metas).toString());
  const [state, action] = useActionState(updateMeta, null);
  useActionResult(state);

  return (
    <form action={action} className={s.layoutForm}>
      <input type="hidden" name="key" value={KEY_META.HOME_LAYOUT} />
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
