"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "postflow-cookie-consent";

type Consent = "all" | "necessary" | null;

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  function choose(value: Exclude<Consent, null>) {
    window.localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 p-4 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Usamos cookies essenciais para o funcionamento do site e, com sua
          permissão, cookies de desempenho e marketing. Veja nossa{" "}
          <Link href="/cookies" className="text-primary hover:underline">
            Política de Cookies
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={() => choose("necessary")}>
            Recusar opcionais
          </Button>
          <Button size="sm" onClick={() => choose("all")}>
            Aceitar todos
          </Button>
        </div>
      </div>
    </div>
  );
}
