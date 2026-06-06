import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, PlayCircle } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Conheça a Wilson Sons — Experience Platform" },
      { name: "description", content: "Conheça a história, missão e operações da Wilson Sons." },
      { property: "og:title", content: "Conheça a Wilson Sons" },
      { property: "og:description", content: "Mais de 180 anos impulsionando o setor marítimo brasileiro." },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Conheça</p>
      <h1 className="mt-2 text-4xl font-bold text-foreground sm:text-5xl">A Wilson Sons</h1>
      <p className="mt-4 max-w-3xl text-muted-foreground">
        Fundada em 1837, a Wilson Sons é uma das mais antigas e completas operadoras logísticas marítimas do Brasil. Atuamos em terminais portuários, rebocagem, agenciamento marítimo, estaleiros e logística — conectando o país aos principais hubs globais.
      </p>

      <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elegant)]">
        <div className="relative aspect-video w-full bg-primary">
          <iframe
            className="absolute inset-0 h-full w-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Wilson Sons - Vídeo Institucional"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="flex items-center gap-3 border-t border-border px-5 py-4 text-sm text-muted-foreground">
          <PlayCircle className="h-5 w-5 text-accent" />
          Vídeo institucional Wilson Sons
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          { t: "Missão", d: "Conectar o Brasil ao mundo com excelência operacional e segurança." },
          { t: "Visão", d: "Ser a operadora marítima de referência em inovação e sustentabilidade." },
          { t: "Valores", d: "Segurança, integridade, foco no cliente e responsabilidade ambiental." },
        ].map((b) => (
          <div key={b.t} className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-semibold text-accent">{b.t}</p>
            <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-end">
        <Link
          to="/seguranca"
          className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-accent)] hover:opacity-95"
        >
          Continuar <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}