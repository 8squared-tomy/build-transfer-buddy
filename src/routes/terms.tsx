import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/pages/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Terms & privacy — 8squared Chess Club" },
      { name: "description", content: "Terms of use and privacy information for the 8squared chess club website." },
      { property: "og:title", content: "Terms & privacy — 8squared Chess Club" },
      { property: "og:description", content: "Terms of use and privacy information for the 8squared chess club website." },
    ],
  }),
  component: LegalPage,
});
