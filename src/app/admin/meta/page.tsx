import React, { Fragment } from "react";
import { KEY_META, SEO } from "@/constants/admin.ts";
import TextAreaForm from "@/components/admin/text/textAreaForm.tsx";
import InputForm from "@/components/admin/text/inputForm.tsx";
import { KeyMeta } from "@/lib/type.ts";
import { getMetas, updateMeta } from "@/app/admin/meta/action.ts";

export default async function Page() {
  const metaMap = await getMetas();
  const isM = metaMap.get(KEY_META.OWNER)?.startsWith("M");

  return (
    <>
      <h1>Gestion des métadonnées</h1>
      <h3>
        (Données accessibles par les moteurs de recherche, pour le
        référencement)
      </h3>
      {Object.entries(SEO).map(([k, value]) => {
        const key = k as KeyMeta;
        if (!isM && (key.endsWith("Drawing") || key.endsWith("DrawingHome")))
          return;
        const isTextArea = key.startsWith("description") || key === "keywords";
        return (
          <Fragment key={key}>
            {!isTextArea && (
              <InputForm
                dbKey={key}
                text={metaMap.get(key) || ""}
                updateAction={updateMeta}
                title={value}
                metaLayout={true}
              />
            )}
            {isTextArea && (
              <>
                <TextAreaForm
                  dbKey={key}
                  text={metaMap.get(key) || ""}
                  updateAction={updateMeta}
                  title={value}
                  metaLayout={true}
                />
                <span>
                  <br />
                  <br />
                  ***
                </span>
              </>
            )}
          </Fragment>
        );
      })}
    </>
  );
}
