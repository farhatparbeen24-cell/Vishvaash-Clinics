import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  index?: string;
  className?: string;
};

/**
 * Editorial section heading: eyebrow rule + serif display title + lede.
 * `index` renders a small editorial number like "01".
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  tone = "light",
  index,
  className,
}: Props) {
  const dark = tone === "dark";
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p
        className={cn(
          "flex items-center gap-3 text-[11px] font-bold tracking-[0.22em] uppercase",
          align === "center" && "justify-center",
          dark ? "text-aqua/80" : "text-trust"
        )}
      >
        {index && (
          <span
            aria-hidden
            className={cn(
              "font-display text-sm tracking-normal",
              dark ? "text-sand" : "text-sand-deep"
            )}
          >
            {index}
          </span>
        )}
        <span
          aria-hidden
          className={cn("h-px w-8", dark ? "bg-aqua/40" : "bg-trust/40")}
        />
        {eyebrow}
      </p>
      <h2
        className={cn(
          "font-display mt-4 text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.12] tracking-[-0.01em] text-balance",
          dark ? "text-offwhite" : "text-navy"
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "mt-4 text-[15px] sm:text-base leading-relaxed",
            dark ? "text-aqua/75" : "text-ink-soft"
          )}
        >
          {lede}
        </p>
      )}
    </Reveal>
  );
}
