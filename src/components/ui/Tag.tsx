import type { ReactNode } from "react";
import { RbcMicro } from "@/components/brand/Erythrocyte";

export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "blue" | "red" }) {
  const tones = {
    neutral: "border bg-surface text-ink-600",
    blue: "border-blue-600/25 bg-blue-600/6 text-blue-700",
    red: "border-red-600/25 bg-red-600/6 text-red-700",
  } as const;

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

/** Lista técnica com RBC Micro como marcador — uso pontual, não global. */
export function RbcList({ items, tone = "red" }: { items: string[]; tone?: "red" | "blue" }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm text-ink-800">
          <span className="mt-[0.45rem]">
            <RbcMicro tone={tone} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
