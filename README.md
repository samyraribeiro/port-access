# ⚓ Wilson Sons Experience Platform

> **Portal PortoSeguro WS — Gestão de Visitas e Triagem de Riscos**  
> *Desafio prático baseado na metodologia PBL aplicado para a Wilson Sons através do curso Be Digital (Trilha Power Developer) na KODIE Academy.*

---

## 📋 Visão Geral do Projeto

A **Wilson Sons Experience Platform** é uma solução inteligente de *CapEx Zero* desenvolvida para centralizar, otimizar e automatizar o agendamento de visitas institucionais aos portos e estaleiros da empresa. 

O foco principal da plataforma é mitigar os gargalos operacionais gerados por processos manuais (como retrabalho e falhas de controle) e eliminar riscos de acidentes no ambiente industrial através de um fluxo imersivo de triagem e validação de Equipamentos de Proteção Individual (EPI).

---

## 🚀 A Jornada Inovadora do Visitante (UX/UI Premium)

Para se destacar dos formulários tradicionais, a interface foi projetada como uma **Single Page Application (SPA)** moderna e dinâmica baseada em etapas (*Stepper*):

1. **Briefing de Segurança (Imersão):** O visitante é recepcionado pela história da Wilson Sons e assiste obrigatoriamente ao vídeo institucional integrado de operações portuárias.
2. **Simulador de Conformidade (EPI):** Um quiz interativo gamificado com cards visuais de vestimentas. O sistema barra trajes inadequados (como regatas, shorts ou calçados abertos) e gera um **Selo de Conformidade** se o usuário selecionar corretamente os EPIs obrigatórios (capacete, botas e colete).
3. **Credenciamento (Passaporte de Entrada):** Coleta otimizada de dados de acordo com o perfil do usuário (Estudante, Professor, Profissional, Empresa ou Entusiasta Naval), gerando um número de protocolo corporativo único.
4. **Dashboard Administrativo (Visão Executiva):** Um console gerencial exclusivo para a equipe interna/SESMT monitorar KPIs em tempo real, filtrar solicitações e auditar os acessos à portaria.

---

## 🛠️ Stack Tecnológica

O ecossistema foi construído utilizando ferramentas ágeis integradas por código de alto desempenho:

*   **Frontend (Interface Low-Code):** `Lovable` (React + Tailwind CSS) para garantir responsividade, acessibilidade e micro-interações fluidas.
*   **Banco de Dados Centralizado:** `Google Sheets` atuando como a central unificada de armazenamento em nuvem.
*   **Back-end & Automação (API):** `Google Apps Script` processando requisições assíncronas (POST/OPTIONS com suporte total a CORS), gravando logs de auditoria e tratando controle dinâmico de fluxos.
*   **Notificação Automatizada:** Disparo em tempo real de e-mails corporativos estilizados em HTML (para o Visitante confirmando as regras de EPI e para o Host interno da Wilson Sons para aprovação).
*   **Inteligência Artificial:** Engenharia de prompts avançada estruturada via `Google AI Studio`.

---

## 📁 Estrutura do Banco de Dados (Google Sheets)

A automação manipula e estrutura os dados de forma transparente através de duas abas de auditoria:

### Aba: `Visitas`
Armazena a folha de presença e o passaporte técnico do agendamento:
`ID (Protocolo)` | `Data/Hora` | `Nome` | `E-mail` | `Telefone` | `Empresa` | `Perfil` | `Motivo` | `Data da Visita` | `Horário` | `Host` | `E-mail Host` | `Nota Quiz` | `Status`

### Aba: `Logs`
Registra a telemetria e o sucesso do disparo de e-mails do sistema:
`Quando` | `ID Visita` | `Destinatário` | `Tipo (Host/Visitante)` | `Status` | `Erro`

---

## 🔧 Configuração e Instalação do Back-end

Para replicar o motor de automação deste projeto no Google Apps Script:

1. Crie uma Google Planilha e copie o seu `ID` presente na URL do navegador.
2. Acesse **Extensões > Apps Script** e insira o código contido em `Código.gs`.
3. Substitua a constante global com o identificador da sua planilha:
```javascript
   const SHEET_ID = 'SEU_ID_LONGO_AQUI';
