import { createFileRoute, Link } from "@tanstack/react-router";
import { Anchor, Ship, Globe2, Award, Calendar, ShieldCheck, ArrowRight, Building2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wilson Sons Experience Platform — Portaria Digital" },
      { name: "description", content: "Agende sua visita aos terminais e estaleiros Wilson Sons de forma 100% digital, segura e centralizada." },
      { property: "og:title", content: "Wilson Sons Experience Platform" },
      { property: "og:description", content: "A portaria digital para o futuro do setor marítimo." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 opacity-20" aria-hidden>
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-0 -left-24 h-96 w-96 rounded-full bg-primary-glow blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28">
          <div className="text-primary-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium tracking-wide text-accent">
              <Anchor className="h-3.5 w-3.5" /> Portaria Digital · Wilson Sons
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              A Portaria Digital para o <span className="text-accent">Futuro</span> do Setor Marítimo
            </h1>
            <p className="mt-6 max-w-xl text-base text-primary-foreground/80 sm:text-lg">
              Agende, valide e acompanhe visitas aos portos e estaleiros Wilson Sons em um único lugar — com segurança, conformidade e velocidade.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/agendar"
                className="group inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-accent)] transition-transform hover:scale-[1.02]"
              >
                Agendar Minha Visita
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/sobre"
                className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 bg-primary-foreground/5 px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10"
              >
                Conheça a Wilson Sons
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-primary-foreground/80">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent" /> Conformidade total</span>
              <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 text-accent" /> Agendamento em minutos</span>
              <span className="inline-flex items-center gap-2"><Building2 className="h-4 w-4 text-accent" /> 12 terminais integrados</span>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute inset-0 rounded-3xl border border-primary-foreground/10 bg-primary-foreground/5 backdrop-blur" />
            <div className="relative grid h-full place-items-center p-8">
              <Ship className="h-48 w-48 text-accent" strokeWidth={1.2} />
            </div>
          </div>
        </div>
      </section>

      {/* INSTITUCIONAL */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Quem somos</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Tradição marítima, tecnologia de fronteira
          </h2>
          <p className="mt-4 text-muted-foreground">
            Há mais de 180 anos a Wilson Sons impulsiona o comércio marítimo brasileiro com operações portuárias, rebocagem, estaleiros e logística integrada — atendendo clientes em mais de 50 países.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Award, value: "+180 anos", label: "de experiência marítima" },
            { icon: Anchor, value: "12 terminais", label: "portuários no Brasil" },
            { icon: Globe2, value: "+50 países", label: "atendidos globalmente" },
          ].map((c) => (
            <div
              key={c.label}
              className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <c.icon className="h-6 w-6" />
              </span>
              <p className="mt-5 text-3xl font-bold text-foreground">{c.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-y border-border bg-secondary">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-14 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
          <div>
            <h3 className="text-2xl font-bold text-foreground">Pronto para visitar nossos terminais?</h3>
            <p className="mt-2 text-muted-foreground">Complete o quiz de segurança e agende em poucos minutos.</p>
          </div>
          <Link
            to="/seguranca"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] hover:bg-primary-glow"
          >
            Começar agora <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
