export type VisitStatus = "pendente" | "aprovada" | "reprovada";

export type Visit = {
  protocolo: string;
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  perfil: string;
  motivo: string;
  data: string;
  horario: string;
  host: string;
  quizScore: number;
  status: VisitStatus;
  createdAt: string;
};

const KEY = "wilson_visits_v1";

function seed(): Visit[] {
  return [
    {
      protocolo: "WS-2025-0001",
      nome: "Ana Carolina Souza",
      email: "ana@exemplo.com",
      telefone: "+55 21 99999-0001",
      empresa: "UFRJ",
      perfil: "Estudante",
      motivo: "Visita técnica de Engenharia Naval",
      data: "2026-06-15",
      horario: "10:00",
      host: "Carlos Mendes",
      quizScore: 100,
      status: "aprovada",
      createdAt: new Date().toISOString(),
    },
    {
      protocolo: "WS-2025-0002",
      nome: "Bruno Lima",
      email: "bruno@empresa.com",
      telefone: "+55 11 98888-0002",
      empresa: "PortLogix",
      perfil: "Profissional",
      motivo: "Reunião comercial",
      data: "2026-06-20",
      horario: "14:30",
      host: "Mariana Alves",
      quizScore: 80,
      status: "pendente",
      createdAt: new Date().toISOString(),
    },
    {
      protocolo: "WS-2025-0003",
      nome: "Pedro Henrique",
      email: "pedro@naval.com",
      telefone: "+55 21 97777-0003",
      empresa: "Independente",
      perfil: "Entusiasta Naval",
      motivo: "Tour fotográfico",
      data: "2026-06-22",
      horario: "09:00",
      host: "Juliana Castro",
      quizScore: 60,
      status: "reprovada",
      createdAt: new Date().toISOString(),
    },
  ];
}

export function getVisits(): Visit[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const s = seed();
    localStorage.setItem(KEY, JSON.stringify(s));
    return s;
  }
  try {
    return JSON.parse(raw) as Visit[];
  } catch {
    return [];
  }
}

export function saveVisits(v: Visit[]) {
  localStorage.setItem(KEY, JSON.stringify(v));
}

export function addVisit(v: Omit<Visit, "protocolo" | "createdAt" | "status">): Visit {
  const all = getVisits();
  const proto = `WS-${new Date().getFullYear()}-${String(all.length + 1).padStart(4, "0")}`;
  const visit: Visit = {
    ...v,
    protocolo: proto,
    createdAt: new Date().toISOString(),
    status: "pendente",
  };
  saveVisits([visit, ...all]);
  return visit;
}

export function updateStatus(protocolo: string, status: VisitStatus) {
  const all = getVisits().map((v) => (v.protocolo === protocolo ? { ...v, status } : v));
  saveVisits(all);
}

export const QUIZ_KEY = "wilson_quiz_passed_v1";
export function quizPassed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(QUIZ_KEY) === "1";
}
export function setQuizPassed(score: number) {
  localStorage.setItem(QUIZ_KEY, "1");
  localStorage.setItem("wilson_quiz_score_v1", String(score));
}
export function getQuizScore(): number {
  const v = localStorage.getItem("wilson_quiz_score_v1");
  return v ? Number(v) : 0;
}