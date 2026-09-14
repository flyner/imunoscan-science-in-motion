import { createFileRoute } from "@tanstack/react-router";
import { getPage, isLifeSciences } from "@/lib/content";
import { CategoryPage, PageNotFound } from "@/components/page/CategoryPage";

export const Route = createFileRoute("/life-sciences/$slug")({
  head: ({ params }) => {
    const page = getPage(params.slug);
    if (!page) {
      return { meta: [{ title: "Categoria não encontrada — ImunoScan" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${page.public_content.title} — ImunoScan Life Sciences`;
    const description =
      page.public_content.short_description ?? page.public_content.subtitle ?? page.title;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: LifeSciencesCategory,
});

function LifeSciencesCategory() {
  const { slug } = Route.useParams();
  const page = getPage(slug);

  if (!page || !isLifeSciences(page)) return <PageNotFound label="Categoria" />;
  return <CategoryPage page={page} />;
}
