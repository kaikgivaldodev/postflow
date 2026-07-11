"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, AtSign, Settings, Plus, LogOut } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendário", icon: Calendar },
  { href: "/settings/accounts", label: "Contas", icon: AtSign },
  { href: "/settings/billing", label: "Configurações", icon: Settings },
];

export function AppSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Logo />
      </div>

      <div className="p-4">
        <Button className="w-full justify-start gap-2" asChild>
          <Link href="/posts/new">
            <Plus className="h-4 w-4" />
            Novo Post
          </Link>
        </Button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_LINKS.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-border p-4">
        <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
        <form action={signOutAction}>
          <Button type="submit" variant="outline" size="sm" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </form>
      </div>
    </aside>
  );
}
