"use client";

import { Work } from "@/lib/type";
import { getSizeText } from "@/lib/utils/commonUtils.ts";

interface Props {
  work: Work;
  isMono: boolean;
}

export default function ImageInfos({ work, isMono }: Props) {
  return (
    <figcaption>
      {!isMono && (
        <>
          <h2>{work.title}</h2>
          <p>
            {`${work.technique} - ${getSizeText(work)} - `}
            <time>{new Date(work.date).getFullYear()}</time>
          </p>
          {work.description !== "" && (
            <p>
              <br />
              {work.description}
            </p>
          )}
          {work.isToSell && (
            <p>
              <br />
              {work.price ? `Prix : ${work.price} euros` : "À vendre"}
            </p>
          )}
          {work.sold && (
            <p>
              <br />
              {work.price ? `Prix : ${work.price} euros - Vendu` : "Vendu"}
            </p>
          )}
        </>
      )}
      {isMono && (
        <>
          <h2>{work.title}</h2>
          <p>{work.technique}</p>
          <p>{getSizeText(work)}</p>
          <p>
            <time>{new Date(work.date).getFullYear()}</time>
          </p>
          {work.description !== "" && (
            <p>
              <br />
              {work.description}
            </p>
          )}
          {work.isToSell && (
            <p>
              <br />
              {work.price ? `Prix : ${work.price} euros` : "À vendre"}
            </p>
          )}
          {work.sold && (
            <p>
              <br />
              {work.price ? `Prix : ${work.price} euros - Vendu` : "Vendu"}
            </p>
          )}
        </>
      )}
    </figcaption>
  );
}
