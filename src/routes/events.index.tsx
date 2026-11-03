import { createFileRoute } from "@tanstack/react-router";
import { EventsPage } from "@/pages/EventsPage";

export const Route = createFileRoute("/events/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Events — 8squared Chess Club" },
      { name: "description", content: "Upcoming tournaments, training sessions and friendly matches at 8squared." },
      { property: "og:title", content: "Events — 8squared Chess Club" },
      { property: "og:description", content: "Upcoming tournaments, training sessions and friendly matches at 8squared." },
    ],
  }),
  component: EventsPage,
});
