import type { Faq as FaqItem } from "@/lib/content";

export function FaqList({ items, title = "Perguntas técnicas frequentes" }: { items: FaqItem[]; title?: string }) {
  if (!items.length) return null;

  return (
    <section aria-labelledby="faq-title">
      <h2 id="faq-title" className="text-xl font-semibold text-ink-950 md:text-2xl">
        {title}
      </h2>
      <div className="mt-6 divide-y border-y">
        {items.map((item) => (
          <details key={item.question} className="group py-4">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[0.95rem] font-medium text-ink-950 marker:content-none">
              {item.question}
              <span
                aria-hidden="true"
                className="mt-1 grid size-5 shrink-0 place-items-center rounded-full border text-ink-600 transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-open:rotate-45"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </span>
            </summary>
            <p className="prose-tech measure mt-3 text-sm">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
