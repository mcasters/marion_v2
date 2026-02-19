import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    short_name: "Marion Casters",
    name: "Oeuvres de Marion Casters",
    start_url: "/",
    display: "standalone",
    background_color: "#541200",
    theme_color: "#be2d01",
    icons: [
      {
        src: "icon.svg",
        type: "image/svg+xml",
      },
      {
        src: "maskable_icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
