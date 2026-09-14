import type { ButtonHTMLAttributes, ReactNode } from "react";
import { AppLink } from "./AppLink";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "press inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-red-600 text-white hover:bg-red-700",
  secondary: "border border-[var(--border-strong)] bg-white text-blue-700 hover:border-blue-600",
  ghost: "text-blue-700 hover:text-red-600",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[0.95rem]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  to,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: CommonProps & { to: string }) {
  return (
    <AppLink to={to} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </AppLink>
  );
}

export function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`arrow-nudge ${className}`}
    >
      <path d="M2.5 8h10M9 4.5 12.5 8 9 11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
