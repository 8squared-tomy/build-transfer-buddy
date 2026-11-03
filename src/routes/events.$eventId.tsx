import { createFileRoute } from "@tanstack/react-router";
import { EventDetailPage } from "@/pages/EventDetailPage";

export const Route = createFileRoute("/events/$eventId")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Event details — 8squared Chess Club" },
      { name: "description", content: "Event details and registration at the 8squared chess club." },
      { property: "og:title", content: "Event details — 8squared Chess Club" },
      { property: "og:description", content: "Event details and registration at the 8squared chess club." },
    ],
  }),
  component: EventRoute,
});

function EventRoute() {
  const { eventId } = Route.useParams();
  return <EventDetailPage eventId={eventId} />;
}
