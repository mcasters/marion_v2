import { getMetaMap } from "@/lib/utils/commonUtils";
import React, { Fragment } from "react";
import { getMetas } from "@/app/actions/meta";
import { META, SEO } from "@/constants/admin.ts";
import MetaForm from "@/components/admin/content/metaForm.tsx";

export default async function Meta() {
  const metas = getMetaMap(await getMetas());
  const isM = metas.get(META.SITE_TITLE)?.startsWith("M");

  return (
    <>
      <h1>Gestion des métadonnées</h1>
      <h3>
        (Données accessibles par les moteurs de recherche, pour le
        référencement)
      </h3>
      {Object.entries(SEO).map(([key, value]) => {
        const separate = key.startsWith("description") || key === "keywords";
        if (!isM && (key.endsWith("Drawing") || key.endsWith("DrawingHome")))
          return;
        return (
          <Fragment key={key}>
            <MetaForm
              content={metas.get(key) || ""}
              label={value}
              dbLabel={key}
              isTextArea={key.startsWith("description") || key === "keywords"}
            />
            {separate && (
              <span>
                <br />
                <br />
                ***
              </span>
            )}
          </Fragment>
        );
      })}
    </>
  );
}
