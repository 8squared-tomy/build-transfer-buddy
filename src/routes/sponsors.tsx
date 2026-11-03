import { createFileRoute } from "@tanstack/react-router";
import { SponsorsPage } from "@/pages/SponsorsPage";

export const Route = createFileRoute("/sponsors")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Sponsors & partners — 8squared Chess Club" },
      { name: "description", content: "The sponsors and partners supporting the 8squared chess club." },
      { property: "og:title", content: "Sponsors & partners — 8squared Chess Club" },
      { property: "og:description", content: "The sponsors and partners supporting the 8squared chess club." },
    ],
  }),
  component: SponsorsPage,
});
