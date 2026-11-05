import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/pages/HomePage";
import chessCover from "@/assets/chess-cover.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [{ rel: "preload", as: "image", href: chessCover.url, fetchPriority: "high" }],
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: chessCover.url },
      { name: "twitter:image", content: chessCover.url },
      { title: "8squared Chess Club — Learn, train, compete" },
      { name: "description", content: "A home for chess players at every level. Join the 8squared chess club, attend events and grow with us." },
      { property: "og:title", content: "8squared Chess Club — Learn, train, compete" },
      { property: "og:description", content: "A home for chess players at every level. Join the 8squared chess club, attend events and grow with us." },
    ],
  }),
  component: HomePage,
});
