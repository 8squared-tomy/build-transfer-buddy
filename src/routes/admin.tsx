import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/pages/AdminPage";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — 8squared Chess Club" },
      { name: "description", content: "Club management area for 8squared administrators." },
      { property: "og:title", content: "Admin — 8squared Chess Club" },
      { property: "og:description", content: "Club management area for 8squared administrators." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});
