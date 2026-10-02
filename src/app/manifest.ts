import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Guchini Takeaway",
    short_name: "Guchini",
    description: "Pedí online y retirá por tu sucursal.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2ebdd",
    theme_color: "#1b7334",
    icons: [
      {
        src: "/icon.png",
        sizes: "400x400",
        type: "image/png",
      },
    ],
  };
}
