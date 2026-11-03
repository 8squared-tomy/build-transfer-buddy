import { createFileRoute } from "@tanstack/react-router";
import { MembershipPage } from "@/pages/MembershipPage";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Join the club — 8squared Chess Club" },
      { name: "description", content: "Apply for membership at the 8squared chess club with a short skill survey." },
      { property: "og:title", content: "Join the club — 8squared Chess Club" },
      { property: "og:description", content: "Apply for membership at the 8squared chess club with a short skill survey." },
    ],
  }),
  component: MembershipPage,
});
