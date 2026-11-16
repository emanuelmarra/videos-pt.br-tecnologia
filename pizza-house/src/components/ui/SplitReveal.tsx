"use client";

import { m, type Variants } from "framer-motion";
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

const word: Variants = {
  hidden: { y: "110%", rotate: 4 },
  show: { y: "0%", rotate: 0, transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] } },
};

/** Quebra o texto em palavras (mantendo <em> etc.) e as revela em sequência. */
function split(node: ReactNode, key = "w"): ReactNode {
  if (typeof node === "string") {
    return node.split(/(\s+)/).map((part, i) =>
      /^\s+$/.test(part) || part === "" ? (
        part
      ) : (
        <span key={`${key}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <m.span data-reveal="" className="inline-block origin-bottom-left" variants={word}>
            {part}
          </m.span>
        </span>
      ),
    );
  }
  if (Array.isArray(node)) return node.map((n, i) => split(n, `${key}-${i}`));
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    return cloneElement(el, { key }, ...Children.toArray(el.props.children).map((c, i) => split(c, `${key}-${i}`)));
  }
  return node;
}

export function SplitReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <m.span
      data-reveal=""
      className="inline"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
    >
      {split(children)}
    </m.span>
  );
}
