import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Lock, CheckCircle2, XCircle, Eye, Clock, ListChecks, ShieldCheck, ShieldX } from "lucide-react";
import { getVisits, updateStatus, type Visit, type VisitStatus } from "../lib/visits";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Dashboard — Wilson Sons" }] }),
  component: Admin,
});

const ADMIN_PASS = "wilson2025";

function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("wilson_admin") === "1") {
      setAuthed(true);
    }
  }, []);

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-elegant)]">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground">
            <Lock className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-center text-2xl font-bold text-foreground">Dashboard Administrativo</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Acesso restrito. Informe a senha de administrador.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pwd === ADMIN_PASS) {
                sessionStorage.setItem("wilson_admin", "1");
                setAuthed(true);
              } else setErr("Senha incorreta.");
            }}
            className="mt-6 space-y-3"
          >
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Senha"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            {err && <p className="text-xs text-destructive">{err}</p>}
            <button className="w-full rounded-md bg-accent py-2.5 text-sm font-semibold text-accent-foreground">Entrar</button>
            <p className="text-center text-[11px] text-muted-foreground">Dica de demo: wilson2025</p>
          </form>
        </div>
      </div>
    );
  }

  return <AdminPanel />;
}

function AdminPanel() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [filter, setFilter] = useState<"todos" | VisitStatus>("todos");
  const [viewing, setViewing] = useState<Visit | null>(null);

  const refresh = () => setVisits(getVisits());
  useEffect(refresh, []);

  const kpis = useMemo(() => {
    const total = visits.length;
    const pendentes = visits.filter((v) => v.status === "pendente").length;
    const aprovadas = visits.filter((v) => v.status === "aprovada").length;
    const reprovadas = visits.filter((v) => v.status === "reprovada").length;
    return { total, pendentes, aprovadas, reprovadas };
  }, [visits]);

  const filtered = filter === "todos" ? visits : visits.filter((v) => v.status === filter);

  const act = (proto: string, status: VisitStatus) => {
    updateStatus(proto, status);
    refresh();
  };

  const kpiCards = [
    { label: "Total de Visitas", value: kpis.total, icon: ListChecks, color: "bg-primary text-primary-foreground" },
    { label: "Pendentes", value: kpis.pendentes, icon: Clock, color: "bg-amber-500 text-white" },
    { label: "Aprovadas", value: kpis.aprovadas, icon: ShieldCheck, color: "bg-accent text-accent-foreground" },
    { label: "Reprovadas", value: kpis.reprovadas, icon: ShieldX, color: "bg-destructive text-destructive-foreground" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Administração</p>
          <h1 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">Dashboard de Visitas</h1>
        </div>
        <button
          onClick={() => {
            sessionStorage.removeItem("wilson_admin");
            location.reload();
          }}
          className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground"
        >
          Sair
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((k) => (
          <div key={k.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{k.label}</p>
              <span className={`grid h-9 w-9 place-items-center rounded-lg ${k.color}`}>
                <k.icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold text-foreground">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <h2 className="text-lg font-semibold text-foreground">Solicitações</h2>
          <div className="flex flex-wrap gap-1 rounded-md bg-secondary p-1">
            {(["todos", "pendente", "aprovada", "reprovada"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Protocolo</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Host</th>
                <th className="px-4 py-3">Quiz</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                    Nenhum agendamento encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v.protocolo} className="border-t border-border">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{v.protocolo}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{v.nome}</td>
                    <td className="px-4 py-3 text-foreground">{v.empresa}</td>
                    <td className="px-4 py-3 text-foreground">{v.data} {v.horario}</td>
                    <td className="px-4 py-3 text-foreground">{v.host}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        v.quizScore >= 70 ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"
                      }`}>
                        {v.quizScore}%
                      </span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge s={v.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setViewing(v)} title="Visualizar" className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background hover:bg-secondary">
                          <Eye className="h-4 w-4 text-foreground" />
                        </button>
                        <button onClick={() => act(v.protocolo, "aprovada")} title="Aprovar" className="grid h-8 w-8 place-items-center rounded-md bg-accent text-accent-foreground hover:opacity-90">
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => act(v.protocolo, "reprovada")} title="Rejeitar" className="grid h-8 w-8 place-items-center rounded-md bg-destructive text-destructive-foreground hover:opacity-90">
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewing && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4"
          onClick={() => setViewing(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-elegant)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{viewing.protocolo}</p>
                <h3 className="mt-1 text-xl font-bold text-foreground">{viewing.nome}</h3>
              </div>
              <StatusBadge s={viewing.status} />
            </div>
            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              <Info label="E-mail" v={viewing.email} />
              <Info label="Telefone" v={viewing.telefone} />
              <Info label="Empresa" v={viewing.empresa} />
              <Info label="Perfil" v={viewing.perfil} />
              <Info label="Data" v={`${viewing.data} ${viewing.horario}`} />
              <Info label="Host" v={viewing.host} />
              <Info label="Quiz" v={`${viewing.quizScore}%`} />
              <div className="sm:col-span-2">
                <Info label="Motivo" v={viewing.motivo} />
              </div>
            </dl>
            <button
              onClick={() => setViewing(null)}
              className="mt-6 w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, v }: { label: string; v: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-foreground">{v}</p>
    </div>
  );
}

function StatusBadge({ s }: { s: VisitStatus }) {
  const map: Record<VisitStatus, string> = {
    pendente: "bg-amber-500/15 text-amber-600 border border-amber-500/30",
    aprovada: "bg-accent/15 text-accent border border-accent/30",
    reprovada: "bg-destructive/15 text-destructive border border-destructive/30",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${map[s]}`}>{s}</span>
  );
}