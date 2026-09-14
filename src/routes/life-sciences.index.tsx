import { createFileRoute } from "@tanstack/react-router";
import { lifeSciencesHub } from "@/lib/content";
import { CategoryPage } from "@/components/page/CategoryPage";

const TITLE = `${lifeSciencesHub.public_content.title} — ImunoScan`;
const DESCRIPTION = lifeSciencesHub.public_content.short_description ?? "";

export const Route = createFileRoute("/life-sciences/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: () => <CategoryPage page={lifeSciencesHub} />,
});
