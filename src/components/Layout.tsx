import { Link, useRouterState } from "@tanstack/react-router";
import { Anchor, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Assistant } from "./Assistant";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/sobre", label: "Sobre" },
  { to: "/seguranca", label: "Segurança" },
  { to: "/quiz", label: "Quiz" },
  { to: "/agendar", label: "Agendar" },
  { to: "/admin", label: "Admin" },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/85">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 text-primary-foreground">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-accent text-accent-foreground shadow-[var(--shadow-accent)]">
              <Anchor className="h-5 w-5" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-wide">WILSON SONS</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-accent">Experience Platform</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-primary-foreground/80 hover:bg-primary-glow/40 hover:text-primary-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="rounded-md p-2 text-primary-foreground md:hidden"
            aria-label="Abrir menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="border-t border-primary-glow/30 bg-primary md:hidden">
            <nav className="flex flex-col gap-1 px-4 py-3">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-primary-foreground/90 hover:bg-primary-glow/30"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-12 border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-accent text-accent-foreground">
                <Anchor className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold">WILSON SONS</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-accent">Experience Platform</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-primary-foreground/70">
              A portaria digital para o futuro do setor marítimo.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold">Navegação</p>
            <ul className="mt-3 space-y-2 text-sm text-primary-foreground/70">
              {navItems.map((i) => (
                <li key={i.to}>
                  <Link to={i.to} className="hover:text-accent">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Contato</p>
            <ul className="mt-3 space-y-2 text-sm text-primary-foreground/70">
              <li>visitas@wilsonsons.com.br</li>
              <li>+55 21 0000-0000</li>
              <li>Rio de Janeiro · RJ</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-glow/30">
          <p className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-primary-foreground/70 sm:px-6">
            Projeto desenvolvido para fins educativos na KODIE Academy
          </p>
        </div>
      </footer>

      <Assistant />
    </div>
  );
}