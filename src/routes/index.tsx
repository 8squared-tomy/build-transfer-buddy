import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/pages/HomePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "8squared Chess Club — Learn, train, compete" },
      { name: "description", content: "A home for chess players at every level. Join the 8squared chess club, attend events and grow with us." },
      { property: "og:title", content: "8squared Chess Club — Learn, train, compete" },
      { property: "og:description", content: "A home for chess players at every level. Join the 8squared chess club, attend events and grow with us." },
    ],
  }),
  component: HomePage,
});
