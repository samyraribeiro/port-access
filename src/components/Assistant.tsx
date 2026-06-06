import { useState } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

type Msg = { from: "bot" | "user"; text: string };

const FAQ: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["epi", "equipamento", "proteção", "protecao"],
    answer:
      "Os EPIs obrigatórios são: capacete, botas de segurança e colete refletivo. Sem eles, o acesso ao terminal não é permitido.",
  },
  {
    keywords: ["roupa", "vestimenta", "shorts", "regata", "chinelo", "sapato"],
    answer:
      "É proibido o uso de regata, shorts, chinelos e sapatos abertos. Use calça comprida e calçado fechado.",
  },
  {
    keywords: ["agendar", "agendamento", "visita", "marcar"],
    answer:
      'Para agendar acesse a aba "Agendar". Você precisa concluir o quiz de segurança antes de enviar o formulário.',
  },
  {
    keywords: ["quiz", "prova", "teste", "questionário"],
    answer:
      "O quiz tem 5 perguntas e exige 70% de aproveitamento. Caso reprove, basta tentar novamente.",
  },
  {
    keywords: ["wilson", "sons", "empresa", "história", "historia"],
    answer:
      "A Wilson Sons tem mais de 180 anos de atuação, opera 12 terminais portuários e está presente em mais de 50 países.",
  },
  {
    keywords: ["seguranca", "segurança", "regra"],
    answer:
      'As regras completas estão na aba "Segurança". Siga sempre as orientações do host e da equipe operacional.',
  },
  {
    keywords: ["host", "responsavel", "responsável"],
    answer:
      "O host Wilson Sons é o colaborador que receberá você. Informe o nome no formulário de agendamento.",
  },
];

function respond(q: string): string {
  const lower = q.toLowerCase();
  const found = FAQ.find((f) => f.keywords.some((k) => lower.includes(k)));
  return (
    found?.answer ??
    'Sou o Assistente Wilson. Posso ajudar com EPIs, regras de segurança, agendamento de visitas e informações sobre a Wilson Sons. Pergunte algo como "quais EPIs são obrigatórios?".'
  );
}

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: "bot",
      text: "Olá! Sou o Assistente Wilson. Como posso ajudar com sua visita?",
    },
  ]);

  const send = () => {
    const q = input.trim();
    if (!q) return;
    setMessages((m) => [...m, { from: "user", text: q }, { from: "bot", text: respond(q) }]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-foreground shadow-[var(--shadow-accent)] transition-transform hover:scale-105"
        aria-label="Abrir Assistente Wilson"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[28rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-elegant)] animate-in slide-in-from-bottom-4 fade-in">
          <div className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-accent-foreground">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Assistente Wilson</p>
              <p className="text-[11px] text-primary-foreground/70">Online agora</p>
            </div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    m.from === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-card-foreground border border-border"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-border bg-card p-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte algo…"
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="grid h-9 w-9 place-items-center rounded-md bg-accent text-accent-foreground"
              aria-label="Enviar"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}