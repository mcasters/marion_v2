"use client";

import { Lightbox as YetLightbox } from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/styles.css";
import { EnhancedImage, Work } from "@/lib/type";
import { LightboxSlide } from "@/components/image/lightbox/lightboxSlide";
import { useThemeContext } from "@/app/context/themeProvider.tsx";
import { getSizeText } from "@/lib/utils/commonUtils.ts";

type Props = {
  enhancedImages: EnhancedImage[];
  index: number;
  onClose: () => void;
  isSmall: boolean;
};

export default function Lightbox({
  enhancedImages,
  index,
  onClose,
  isSmall,
}: Props) {
  const theme = useThemeContext();
  const noButtonNav = isSmall || enhancedImages.length < 2;

  return (
    <YetLightbox
      index={index}
      open={index >= 0}
      close={onClose}
      slides={enhancedImages}
      render={{
        slide: LightboxSlide,
        buttonPrev: noButtonNav ? () => null : undefined,
        buttonNext: noButtonNav ? () => null : undefined,
        slideFooter: ({ slide }) => (
          <>
            {"work" in slide && <LongInfoLightbox work={slide.work as Work} />}
            {"title" in slide && "year" in slide && (
              <InfoLightbox
                title={slide.title as string}
                year={slide.year as number}
              />
            )}
          </>
        ),
      }}
      styles={{
        container: {
          backgroundColor: theme.general.lightbox,
          color: theme.general.lightboxText,
          padding: "0px",
        },
        icon: {
          color: theme.general.lightboxText,
        },
      }}
      plugins={[Zoom]}
      zoom={{
        scrollToZoom: true,
      }}
    />
  );
}

const InfoLightbox = ({ title, year }: { title: string; year: number }) => (
  <p
    style={{
      position: "absolute",
      bottom: "5px",
      height: "30px",
      padding: "0 50px",
    }}
  >
    <span>
      <strong>{title}</strong>
    </span>{" "}
    - {year}
  </p>
);

// For gallery Lightbox
const LongInfoLightbox = ({ work }: { work: Work }) => (
  <p
    style={{
      position: "absolute",
      bottom: "5px",
      height: "57px",
      padding: "0 50px",
    }}
  >
    <span>
      <strong>{work.title}</strong>
    </span>
    {` - ${work.technique} - ${getSizeText(work)} - `}
    <time>{new Date(work.date).getFullYear()}</time>
    <br />
    {work.description !== "" && <span>{work.description}</span>}
    {(work.isToSell || work.sold) && <span>{" - "}</span>}
    {work.isToSell && (
      <span>{work.price ? `Prix : ${work.price} euros` : "À vendre"}</span>
    )}
    {work.sold && (
      <span>{work.price ? `Prix : ${work.price} euros - Vendu` : "Vendu"}</span>
    )}
  </p>
);
