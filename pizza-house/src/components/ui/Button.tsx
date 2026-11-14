import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import { external } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

type Variant = "gold" | "outline" | "dark" | "outline-dark" | "whatsapp";

const variants: Record<Variant, string> = {
  gold: "btn-gold",
  outline: "btn-outline",
  dark: "btn-dark",
  "outline-dark": "btn-outline-dark",
  whatsapp: "btn-whatsapp",
};

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  size?: "md" | "sm";
  /** Ícone à esquerda: WhatsApp ou um ícone qualquer. */
  icon?: "whatsapp" | ReactNode;
  /** Mostra a seta animada à direita. */
  arrow?: boolean;
  /** Abre em nova aba com rel seguro (links externos). */
  isExternal?: boolean;
  children: ReactNode;
}

export function ButtonLink({
  href,
  variant = "gold",
  size = "md",
  icon,
  arrow,
  isExternal,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const ext = isExternal ?? /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className={cn("btn", variants[variant], size === "sm" && "btn-sm", className)}
      {...(ext ? external : {})}
      {...rest}
    >
      {icon === "whatsapp" ? <WhatsAppIcon size={size === "sm" ? 17 : 19} /> : icon}
      <span>{children}</span>
      {arrow && <ArrowRight className="btn-icon-move" size={18} strokeWidth={1.8} aria-hidden="true" />}
      {ext && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  );
}
