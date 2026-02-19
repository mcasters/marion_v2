import { getContentsFull } from "@/app/actions/contents";
import { getSliderPhotoTab } from "@/lib/utils/imageUtils";
import Slideshow from "@/components/image/slideshow/slideshow.tsx";
import React from "react";

export default async function Page() {
  const contents = await getContentsFull();
  const { photos, mainPhotos } = getSliderPhotoTab(contents);

  return <Slideshow portraitPhotos={mainPhotos} landscapePhotos={photos} />;
}
