import Slideshow from "@/components/image/slideshow/slideshow.tsx";
import React from "react";
import { getHomeImages } from "@/app/admin/contentAction.ts";

export default async function Page() {
  const images = await getHomeImages();

  return <Slideshow images={images} />;
}
