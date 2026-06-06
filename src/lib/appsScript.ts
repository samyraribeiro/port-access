import type { Visit } from "./visits";

const URL_KEY = "wilson_apps_script_url_v1";
const LOG_KEY = "wilson_email_logs_v1";
const DEFAULT_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycby1IeBbQBG_EriZbCM4SHoWyKb67IsSd9iROnWF7dcfNny9LFyPdu2ydozjOs-I0sEw/exec";

export type EmailLog = {
  id: string;
  at: string;
  protocolo: string;
  recipients: { visitor: string; host: string };
  status: "enviado" | "erro" | "nao_configurado";
  message?: string;
  response?: unknown;
};

export function getAppsScriptUrl(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(URL_KEY) ?? DEFAULT_APPS_SCRIPT_URL;
}

export function setAppsScriptUrl(url: string) {
  localStorage.setItem(URL_KEY, url.trim());
}

export function getEmailLogs(): EmailLog[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) ?? "[]") as EmailLog[];
  } catch {
    return [];
  }
}

function pushLog(log: EmailLog) {
  const all = [log, ...getEmailLogs()].slice(0, 100);
  localStorage.setItem(LOG_KEY, JSON.stringify(all));
}

function extractErrorMessage(payload: unknown, fallback: string) {
  if (typeof payload !== "string") return fallback;

  const htmlError = payload.match(/<div[^>]*>([^<]*(?:TypeError|ReferenceError|Exception):[^<]*)<\/div>/i)?.[1];
  if (htmlError) return htmlError.trim();

  const bodyText = payload.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return bodyText || fallback;
}

export function clearEmailLogs() {
  localStorage.removeItem(LOG_KEY);
}

/**
 * Envia o agendamento para o Apps Script Web App.
 * Usa Content-Type: text/plain para evitar preflight CORS.
 * O Apps Script lê e.postData.contents e faz JSON.parse.
 */
export async function sendVisitToAppsScript(
  visit: Visit,
  hostEmail: string,
): Promise<EmailLog> {
  const url = getAppsScriptUrl();
  const baseLog: Omit<EmailLog, "status" | "message" | "response"> = {
    id: `LOG-${Date.now()}`,
    at: new Date().toISOString(),
    protocolo: visit.protocolo,
    recipients: { visitor: visit.email, host: hostEmail },
  };

  if (!url) {
    const log: EmailLog = {
      ...baseLog,
      status: "nao_configurado",
      message:
        "URL do Apps Script não configurada. Configure em Admin → Integração Google Sheets.",
    };
    pushLog(log);
    return log;
  }

  const payload = {
    action: "createVisit",
    visit: {
      id: visit.protocolo,
      timestamp: visit.createdAt,
      nome: visit.nome,
      email: visit.email,
      telefone: visit.telefone,
      empresa: visit.empresa,
      perfil: visit.perfil,
      motivo: visit.motivo,
      dataVisita: visit.data,
      horario: visit.horario,
      host: visit.host,
      hostEmail,
      quizScore: visit.quizScore,
      status: "Pendente",
    },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      // text/plain → simple request, sem preflight (Apps Script aceita normalmente)
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });
    const text = await res.text();
    let parsed: unknown = text;
    try {
      parsed = JSON.parse(text);
    } catch {
      /* keep raw */
    }
    const ok = res.ok && (parsed as { ok?: boolean })?.ok !== false;
    const log: EmailLog = {
      ...baseLog,
      status: ok ? "enviado" : "erro",
      message: ok
        ? "Planilha atualizada e e-mails disparados."
        : extractErrorMessage(parsed, `Resposta inesperada (HTTP ${res.status}).`),
      response: parsed,
    };
    pushLog(log);
    return log;
  } catch (e) {
    const log: EmailLog = {
      ...baseLog,
      status: "erro",
      message: e instanceof Error ? e.message : "Falha de rede.",
    };
    pushLog(log);
    return log;
  }
}