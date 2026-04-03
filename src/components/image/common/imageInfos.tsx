"use client";

import { Photo, Work } from "@/lib/type";
import { getSizeText } from "@/lib/utils/commonUtils.ts";

interface Props {
  work: Work | undefined;
  photo?: Photo;
  isForLightbox?: boolean;
  isMono?: boolean;
}

export default function ImageInfos({
  work,
  photo = undefined,
  isForLightbox = false,
  isMono = false,
}: Props) {
  return (
    <figcaption>
      {photo && (
        <InfoLightbox
          title={photo.title}
          year={new Date(photo.date).getFullYear()}
        />
      )}
      {work && !isForLightbox && !isMono && <Info work={work} />}
      {work && !isForLightbox && isMono && <InfoMono work={work} />}
      {work && isForLightbox && <LongInfoLightbox work={work} />}
    </figcaption>
  );
}

// For double and sculpture layout
const Info = ({ work }: { work: Work }) => {
  return (
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
  );
};

// For mono layout
const InfoMono = ({ work }: { work: Work }) => (
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
);

// For lightbox (except gallery layout)
const InfoLightbox = ({ title, year }: { title: string; year: number }) => (
  <p>
    <span>
      <strong>{title}</strong>
    </span>{" "}
    - {year}
  </p>
);

// For gallery Lightbox
const LongInfoLightbox = ({ work }: { work: Work }) => (
  <>
    <p>
      <span>
        <strong>{work.title}</strong>
      </span>
      {` - ${work.technique} - ${getSizeText(work)} - `}
      <time>{new Date(work.date).getFullYear()}</time>
    </p>
    <p>
      {work.description !== "" && <span>{work.description}</span>}
      {(work.isToSell || work.sold) && <span>{" - "}</span>}
      {work.isToSell && (
        <span>{work.price ? `Prix : ${work.price} euros` : "À vendre"}</span>
      )}
      {work.sold && (
        <span>
          {work.price ? `Prix : ${work.price} euros - Vendu` : "Vendu"}
        </span>
      )}
    </p>
  </>
);
