import { createFileRoute } from "@tanstack/react-router";
import { diagnosticHub } from "@/lib/content";
import { CategoryPage } from "@/components/page/CategoryPage";

const TITLE = `${diagnosticHub.public_content.title} — ImunoScan`;
const DESCRIPTION = diagnosticHub.public_content.short_description ?? "";

export const Route = createFileRoute("/diagnostico-imuno-hematologia")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: () => <CategoryPage page={diagnosticHub} />,
});
