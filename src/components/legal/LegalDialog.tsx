"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/components/language/LanguageProvider";

type Kind = "privacy" | "terms";

/** Privacy Policy / Terms + Medical Disclaimer, localized. */
export function LegalDialog({ kind }: { kind: Kind }) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const c = kind === "privacy" ? t.legal.privacy : t.legal.terms;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="underline-offset-4 transition hover:text-aqua hover:underline">
          {kind === "privacy" ? t.footer.privacyLabel : t.footer.termsLabel}
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto nice-scroll rounded-2xl border-line bg-white p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-navy">
            {c.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-ink-soft">
            {c.description}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          {c.sections.map((s) => (
            <div key={s.h}>
              <h3 className="font-display mb-2 mt-6 text-lg text-navy first:mt-0">
                {s.h}
              </h3>
              <p className="mb-3 text-sm leading-relaxed text-ink-soft">{s.p}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
