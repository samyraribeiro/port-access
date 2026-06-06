import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HardHat, Shirt, Footprints, ShieldAlert, ShieldCheck, Ban } from "lucide-react";

export const Route = createFileRoute("/seguranca")({
  head: () => ({
    meta: [
      { title: "Regras de Segurança — Wilson Sons" },
      { name: "description", content: "Vestimenta proibida e EPIs obrigatórios para visitas aos terminais Wilson Sons." },
    ],
  }),
  component: Seguranca,
});

const proibidos = [
  { icon: Shirt, label: "Regata" },
  { icon: Shirt, label: "Shorts" },
  { icon: Footprints, label: "Chinelos" },
  { icon: Footprints, label: "Sapatos abertos" },
];

const obrigatorios = [
  { icon: HardHat, label: "Capacete" },
  { icon: Footprints, label: "Botas de segurança" },
  { icon: Shirt, label: "Colete refletivo" },
];

function Seguranca() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Etapa 1 de 3</p>
        <h1 className="mt-2 text-4xl font-bold text-foreground sm:text-5xl">Regras de Segurança</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          A segurança é inegociável. Antes da sua visita, fique atento à vestimenta e aos EPIs obrigatórios.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {/* PROIBIDO */}
        <div className="rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-destructive text-destructive-foreground">
              <Ban className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-destructive">Proibido</p>
              <h2 className="text-xl font-bold text-foreground">Não é permitido</h2>
            </div>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {proibidos.map((p) => (
              <li key={p.label} className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-card px-4 py-3">
                <p.icon className="h-5 w-5 text-destructive" />
                <span className="text-sm font-medium text-foreground">{p.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* OBRIGATÓRIO */}
        <div className="rounded-2xl border-2 border-accent/30 bg-accent/5 p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">Obrigatório</p>
              <h2 className="text-xl font-bold text-foreground">EPIs exigidos</h2>
            </div>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {obrigatorios.map((p) => (
              <li key={p.label} className="flex items-center gap-3 rounded-lg border border-accent/30 bg-card px-4 py-3">
                <p.icon className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium text-foreground">{p.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-primary/5 p-4 text-sm text-foreground">
        <ShieldAlert className="mt-0.5 h-5 w-5 text-primary" />
        <p>
          O descumprimento destas regras impede o acesso aos terminais. Em caso de dúvida, consulte o Assistente Wilson no canto inferior direito.
        </p>
      </div>

      <div className="mt-10 flex justify-end">
        <Link
          to="/quiz"
          className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-accent)]"
        >
          Ir para o Quiz <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}