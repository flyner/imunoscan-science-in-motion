import { AppLink } from "./AppLink";

export type Crumb = { label: string; to?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Trilha de navegação" className="text-xs text-ink-600">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && (
              <span aria-hidden="true" className="text-[var(--border-strong)]">
                /
              </span>
            )}
            {item.to ? (
              <AppLink to={item.to} className="link-underline hover:text-blue-700">
                {item.label}
              </AppLink>
            ) : (
              <span aria-current="page" className="text-ink-800">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
