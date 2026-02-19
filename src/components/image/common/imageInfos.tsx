"use client";

import { Photo, Work } from "@/lib/type";
import { Fragment } from "react";
import { getSizeText } from "@/lib/utils/commonUtils.ts";

interface Props {
  item: Work | undefined;
  photo?: Photo;
  isForLightbox?: boolean;
  isMono?: boolean;
}

export default function ImageInfos({
  item,
  photo = undefined,
  isForLightbox = false,
  isMono = false,
}: Props) {
  return (
    <figcaption>
      {photo && (
        <ShortInfo
          title={photo.title}
          year={new Date(photo.date).getFullYear()}
        />
      )}
      {item && !isForLightbox && !isMono && <LongInfo item={item} />}
      {item && !isForLightbox && isMono && <LongInfoMono item={item} />}
      {item && isForLightbox && <LongInfoLightbox item={item} />}
    </figcaption>
  );
}

// For lightbox of post and item (except gallery layout)
const ShortInfo = ({ title, year }: { title: string; year: number }) => (
  <p>
    <span>
      <strong>{title}</strong>
    </span>{" "}
    - {year}
  </p>
);

// For item in double and sculpture layout
const LongInfo = ({ item }: { item: Work }) => {
  return (
    <>
      <h2>{item.title}</h2>
      <p>
        {item.technique} - {getSizeText(item)} -{" "}
        <time>{new Date(item.date).getFullYear()}</time>
      </p>
      {item.description !== "" && (
        <>
          <br />
          <p>{item.description}</p>
        </>
      )}
      {item.isToSell && (
        <>
          <br />
          <p>
            {`prix : ${item.price} euros`}
            {item.sold ? "vendu" : ""}
          </p>
        </>
      )}
    </>
  );
};

// For lightbox of item in gallery layout
const LongInfoLightbox = ({ item }: { item: Work }) => (
  <p>
    <span>
      <strong>{item.title}</strong>
    </span>
    {` - ${item.technique} - `}
    {getSizeText(item)}
    {" - "}
    <time>{new Date(item.date).getFullYear()}</time>
  </p>
);

// For item in mono layout
const LongInfoMono = ({ item }: { item: Work }) => (
  <>
    <h2>{item.title}</h2>
    <p>{item.technique}</p>
    <p>{getSizeText(item)}</p>
    <p>
      <time>{new Date(item.date).getFullYear()}</time>
    </p>
    {item.description !== "" && (
      <>
        <p>{item.description}</p>
      </>
    )}
    {item.isToSell && (
      <>
        <p>
          {`prix : ${item.price} euros`}
          {item.sold ? "vendu" : ""}
        </p>
      </>
    )}
  </>
);
