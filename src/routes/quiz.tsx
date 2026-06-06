import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { setQuizPassed } from "../lib/visits";

export const Route = createFileRoute("/quiz")({
  head: () => ({ meta: [{ title: "Quiz de Segurança — Wilson Sons" }] }),
  component: Quiz,
});

type Q = { q: string; options: string[]; correct: number };

const QUESTIONS: Q[] = [
  { q: "É permitido entrar de chinelo nos terminais?", options: ["Sim", "Não", "Apenas em áreas administrativas"], correct: 1 },
  { q: "Qual EPI é obrigatório?", options: ["Boné", "Capacete", "Óculos de sol"], correct: 1 },
  { q: "Qual vestimenta é proibida?", options: ["Calça comprida", "Camisa de manga longa", "Regata"], correct: 2 },
  { q: "O colete refletivo é obrigatório?", options: ["Sim, em todas as áreas operacionais", "Apenas à noite", "Não"], correct: 0 },
  { q: "Qual a aprovação mínima neste quiz?", options: ["50%", "70%", "90%"], correct: 1 },
];

function Quiz() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const correctCount = answers.reduce<number>(
    (acc, a, i) => acc + (a === QUESTIONS[i].correct ? 1 : 0),
    0,
  );
  const score = Math.round((correctCount / QUESTIONS.length) * 100);
  const passed = score >= 70;
  const allAnswered = answers.every((a) => a !== null);

  const reset = () => {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setSubmitted(false);
  };

  const submit = () => {
    setSubmitted(true);
    if (score >= 70) setQuizPassed(score);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Etapa 2 de 3</p>
      <h1 className="mt-2 text-4xl font-bold text-foreground sm:text-5xl">Quiz de Segurança</h1>
      <p className="mt-3 text-muted-foreground">
        Responda as 5 perguntas. Aprovação mínima de 70% para liberar o agendamento.
      </p>

      <div className="mt-8 space-y-5">
        {QUESTIONS.map((q, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="flex items-start gap-2 text-sm font-semibold text-foreground">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-primary text-xs text-primary-foreground">
                {i + 1}
              </span>
              {q.q}
            </p>
            <div className="mt-4 grid gap-2">
              {q.options.map((opt, idx) => {
                const selected = answers[i] === idx;
                const showRight = submitted && idx === q.correct;
                const showWrong = submitted && selected && idx !== q.correct;
                return (
                  <label
                    key={idx}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${
                      showRight
                        ? "border-accent bg-accent/10 text-foreground"
                        : showWrong
                          ? "border-destructive bg-destructive/10 text-foreground"
                          : selected
                            ? "border-primary bg-primary/5 text-foreground"
                            : "border-border bg-background hover:bg-secondary"
                    }`}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      name={`q-${i}`}
                      checked={selected}
                      disabled={submitted}
                      onChange={() => {
                        const next = [...answers];
                        next[i] = idx;
                        setAnswers(next);
                      }}
                    />
                    <span
                      className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
                        selected ? "border-primary bg-primary" : "border-muted-foreground/40"
                      }`}
                    >
                      {selected && <span className="h-2 w-2 rounded-full bg-primary-foreground" />}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {showRight && <CheckCircle2 className="h-4 w-4 text-accent" />}
                    {showWrong && <XCircle className="h-4 w-4 text-destructive" />}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={submit}
          disabled={!allAnswered}
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-accent)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Enviar respostas
        </button>
      ) : (
        <div className={`mt-8 rounded-xl border-2 p-6 ${passed ? "border-accent bg-accent/5" : "border-destructive bg-destructive/5"}`}>
          <div className="flex items-center gap-3">
            {passed ? <CheckCircle2 className="h-7 w-7 text-accent" /> : <XCircle className="h-7 w-7 text-destructive" />}
            <div>
              <p className="text-lg font-bold text-foreground">
                {passed ? "Aprovado!" : "Reprovado"} — {score}%
              </p>
              <p className="text-sm text-muted-foreground">
                Você acertou {correctCount} de {QUESTIONS.length} perguntas.
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {passed ? (
              <button
                onClick={() => navigate({ to: "/agendar" })}
                className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
              >
                Continuar para Agendamento <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                <RotateCcw className="h-4 w-4" /> Tentar novamente
              </button>
            )}
            <Link
              to="/seguranca"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground"
            >
              Rever regras
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}