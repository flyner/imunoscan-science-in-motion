import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";

type Props = Omit<ComponentProps<typeof Link>, "to"> & {
  to: string;
  children?: ReactNode;
};

/**
 * Wrapper único sobre <Link> para rotas montadas a partir do JSON
 * (slugs de categorias, produtos e aplicações), preservando o roteador
 * do TanStack em toda a navegação interna.
 */
export function AppLink({ to, ...rest }: Props) {
  return <Link to={to as never} {...rest} />;
}
