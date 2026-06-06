import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Lock, Copy, ArrowRight, Mail, AlertTriangle, Loader2 } from "lucide-react";
import { addVisit, getQuizScore, quizPassed, type Visit } from "../lib/visits";
import { sendVisitToAppsScript, type EmailLog } from "../lib/appsScript";

export const Route = createFileRoute("/agendar")({
  head: () => ({ meta: [{ title: "Agendar Visita — Wilson Sons" }] }),
  component: Agendar,
});

const perfis = ["Estudante", "Professor", "Profissional", "Empresa", "Entusiasta Naval"];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-shadow focus:ring-2 focus:ring-ring";

function Agendar() {
  const allowed = typeof window !== "undefined" ? quizPassed() : false;
  const [submitted, setSubmitted] = useState<Visit | null>(null);
  const [emailLog, setEmailLog] = useState<EmailLog | null>(null);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    perfil: "",
    motivo: "",
    data: "",
    horario: "",
    host: "",
  });
  const [hostEmail, setHostEmail] = useState("");

  if (!allowed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-[var(--shadow-elegant)]">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground">
            <Lock className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-foreground">Quiz obrigatório</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Conclua o Quiz de Segurança com no mínimo 70% de aproveitamento para liberar o agendamento.
          </p>
          <Link
            to="/quiz"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-accent)]"
          >
            Fazer o quiz <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 sm:px-6">
        <div className="rounded-2xl border border-accent/30 bg-card p-8 text-center shadow-[var(--shadow-elegant)]">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-foreground">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-foreground">Agendamento enviado!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Recebemos sua solicitação. O host {submitted.host || "Wilson Sons"} fará a validação.
          </p>
          <div className="mt-6 rounded-lg border border-border bg-secondary p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Número de protocolo</p>
            <p className="mt-1 flex items-center justify-center gap-2 text-2xl font-bold text-primary">
              {submitted.protocolo}
              <button
                onClick={() => navigator.clipboard?.writeText(submitted.protocolo)}
                className="rounded-md p-1 text-muted-foreground hover:bg-card hover:text-foreground"
                aria-label="Copiar protocolo"
              >
                <Copy className="h-4 w-4" />
              </button>
            </p>
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/" className="rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground">
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Etapa 3 de 3</p>
      <h1 className="mt-2 text-4xl font-bold text-foreground sm:text-5xl">Formulário de Agendamento</h1>
      <p className="mt-3 text-muted-foreground">Preencha os dados para registrar sua visita.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const visit = addVisit({ ...form, quizScore: getQuizScore() });
          setSubmitted(visit);
        }}
        className="mt-8 grid gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <Field label="Nome completo">
            <input required className={inputClass} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </Field>
        </div>
        <Field label="E-mail">
          <input required type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field label="Telefone">
          <input required className={inputClass} value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
        </Field>
        <Field label="Empresa ou instituição">
          <input required className={inputClass} value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} />
        </Field>
        <Field label="Perfil do visitante">
          <select required className={inputClass} value={form.perfil} onChange={(e) => setForm({ ...form, perfil: e.target.value })}>
            <option value="">Selecione…</option>
            {perfis.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Motivo da visita">
            <textarea required rows={3} className={inputClass} value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} />
          </Field>
        </div>
        <Field label="Data desejada">
          <input required type="date" className={inputClass} value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
        </Field>
        <Field label="Horário desejado">
          <input required type="time" className={inputClass} value={form.horario} onChange={(e) => setForm({ ...form, horario: e.target.value })} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Host Wilson Sons responsável">
            <input required className={inputClass} value={form.host} onChange={(e) => setForm({ ...form, host: e.target.value })} placeholder="Nome do host que recebe você" />
          </Field>
        </div>

        <div className="sm:col-span-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-accent)] transition-transform hover:scale-[1.02]"
          >
            Enviar agendamento <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      <p className="mt-4 text-xs text-muted-foreground">
        Integração preparada para Google Sheets + Apps Script (envio automático de e-mails). Dados armazenados localmente nesta demo.
      </p>
    </div>
  );
}