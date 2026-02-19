"use client";

import { Lightbox as YetLightbox } from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/styles.css";
import { Photo, PhotoEnhanced } from "@/lib/type";
import { LightboxSlide } from "@/components/image/lightbox/lightboxSlide";
import ImageInfos from "@/components/image/common/imageInfos";
import { useTheme } from "@/app/context/themeProvider.tsx";

type Props = {
  photos: Photo[] | PhotoEnhanced[];
  index: number;
  onClose: () => void;
  isSmall: boolean;
};

export default function Lightbox({ photos, index, onClose, isSmall }: Props) {
  const theme = useTheme();

  return (
    <YetLightbox
      index={index}
      open={index >= 0}
      close={onClose}
      slides={photos}
      render={{
        slide: LightboxSlide,
        buttonPrev: isSmall || photos.length <= 1 ? () => null : undefined,
        buttonNext: isSmall || photos.length <= 1 ? () => null : undefined,
        slideContainer: ({ slide, children }) => (
          <>
            {children}
            <div style={{ position: "absolute", bottom: "15px" }}>
              <ImageInfos
                item={"item" in slide ? slide.item : undefined}
                photo={"item" in slide ? undefined : (slide as Photo)}
                isForLightbox={true}
              />
            </div>
          </>
        ),
      }}
      styles={{
        container: {
          backgroundColor: theme.general.lightbox,
          color: theme.general.lightboxText,
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
