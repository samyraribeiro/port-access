/**
 * Wilson Sons Experience Platform — Google Apps Script
 * ----------------------------------------------------
 * Recebe agendamentos via POST, grava na planilha e dispara
 * e-mails para o visitante e o host responsável, com as
 * regras de segurança.
 *
 * COMO PUBLICAR:
 *  1. Crie uma Google Sheet e copie o ID dela (parte da URL
 *     entre /d/ e /edit).
 *  2. Em script.google.com crie um novo projeto, cole este
 *     arquivo e ajuste as CONSTANTES abaixo.
 *  3. Execute uma vez a função `setup()` (vai pedir permissões).
 *  4. Implantar → Nova implantação → Tipo: "App da Web"
 *       - Executar como: Eu
 *       - Quem tem acesso: Qualquer pessoa
 *  5. Copie a URL "/exec" e cole em Admin → Integração.
 */

// ====== CONFIGURAÇÃO ======
const SHEET_ID         = 'COLOQUE_O_ID_DA_SUA_PLANILHA_AQUI';
const SHEET_VISITS     = 'Visitas';
const SHEET_LOGS       = 'Logs';
const FROM_NAME        = 'Wilson Sons Experience Platform';
const ADMIN_FALLBACK   = 'visitas@wilsonsons.com.br'; // host fallback

const HEADERS = [
  'ID','Data/Hora','Nome','E-mail','Telefone','Empresa','Perfil',
  'Motivo','Data da Visita','Horário','Host','E-mail Host',
  'Nota Quiz','Status'
];
const LOG_HEADERS = ['Quando','ID Visita','Destinatário','Tipo','Status','Erro'];

// ====== SETUP ======
function setup() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  ensureSheet_(ss, SHEET_VISITS, HEADERS);
  ensureSheet_(ss, SHEET_LOGS, LOG_HEADERS);
}

function ensureSheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
}

// ====== HTTP ENTRYPOINTS ======
function doGet(e) {
  return jsonOut_({ ok: true, service: 'Wilson Sons Experience Platform' });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    if (body.action === 'createVisit') {
      return handleCreateVisit_(body.visit || {});
    }
    return jsonOut_({ ok: false, error: 'Ação desconhecida' });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

// ====== HANDLER ======
function handleCreateVisit_(v) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  ensureSheet_(ss, SHEET_VISITS, HEADERS);
  ensureSheet_(ss, SHEET_LOGS, LOG_HEADERS);

  const sh = ss.getSheetByName(SHEET_VISITS);
  sh.appendRow([
    v.id, v.timestamp, v.nome, v.email, v.telefone, v.empresa, v.perfil,
    v.motivo, v.dataVisita, v.horario, v.host, v.hostEmail || '',
    v.quizScore, v.status || 'Pendente'
  ]);

  const visitorRes = sendEmail_(v.email, subjectVisitor_(v), htmlForVisitor_(v));
  log_(ss, v.id, v.email, 'Visitante', visitorRes);

  const hostTo = v.hostEmail || ADMIN_FALLBACK;
  const hostRes = sendEmail_(hostTo, subjectHost_(v), htmlForHost_(v));
  log_(ss, v.id, hostTo, 'Host', hostRes);

  return jsonOut_({
    ok: true,
    protocolo: v.id,
    emails: { visitor: visitorRes, host: hostRes },
  });
}

function sendEmail_(to, subject, html) {
  try {
    MailApp.sendEmail({
      to: to, subject: subject, htmlBody: html, name: FROM_NAME,
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

function log_(ss, id, to, tipo, res) {
  const sh = ss.getSheetByName(SHEET_LOGS);
  sh.appendRow([
    new Date(), id, to, tipo,
    res.ok ? 'Enviado' : 'Erro',
    res.ok ? '' : (res.error || ''),
  ]);
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ====== TEMPLATES ======
function subjectVisitor_(v) {
  return '✅ Solicitação de visita recebida — Protocolo ' + v.id;
}
function subjectHost_(v) {
  return '📬 Nova solicitação de visita — ' + v.nome + ' (' + v.id + ')';
}

function safetyBlockHtml_() {
  return [
    '<h3 style="color:#001B4E;margin:24px 0 8px;">Regras de Segurança</h3>',
    '<p style="margin:0 0 8px;color:#334155;">A segurança é inegociável. Antes da sua visita, observe:</p>',
    '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:8px;">',
      '<tr>',
        '<td style="vertical-align:top;width:50%;padding:12px;background:#fff1f2;border:1px solid #fecdd3;border-radius:8px;">',
          '<strong style="color:#b91c1c;">🚫 Proibido</strong>',
          '<ul style="margin:8px 0 0 18px;color:#334155;">',
            '<li>Regata</li><li>Shorts</li><li>Chinelos</li><li>Sapatos abertos</li>',
          '</ul>',
        '</td>',
        '<td style="width:8px;"></td>',
        '<td style="vertical-align:top;width:50%;padding:12px;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;">',
          '<strong style="color:#c2410c;">✅ Obrigatório</strong>',
          '<ul style="margin:8px 0 0 18px;color:#334155;">',
            '<li>Capacete</li><li>Botas de segurança</li><li>Colete refletivo</li>',
          '</ul>',
        '</td>',
      '</tr>',
    '</table>',
  ].join('');
}

function shell_(title, innerHtml) {
  return [
    '<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">',
      '<div style="background:#001B4E;padding:20px 24px;color:#fff;border-radius:8px 8px 0 0;">',
        '<div style="font-size:11px;letter-spacing:.18em;color:#FF6B00;">WILSON SONS</div>',
        '<div style="font-size:20px;font-weight:bold;margin-top:4px;">', title, '</div>',
      '</div>',
      '<div style="padding:24px;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 8px 8px;color:#0f172a;">',
        innerHtml,
        '<p style="margin-top:28px;font-size:12px;color:#64748b;">Projeto desenvolvido para fins educativos na KODIE Academy.</p>',
      '</div>',
    '</div>',
  ].join('');
}

function detailsTable_(v) {
  const row = (k, val) =>
    '<tr><td style="padding:6px 8px;color:#64748b;width:160px;">'+k+'</td>' +
    '<td style="padding:6px 8px;color:#0f172a;font-weight:600;">'+val+'</td></tr>';
  return [
    '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:8px;font-size:14px;">',
      row('Protocolo', v.id),
      row('Nome', v.nome),
      row('Empresa', v.empresa),
      row('Perfil', v.perfil),
      row('Data', v.dataVisita + ' ' + v.horario),
      row('Host', v.host),
      row('Quiz', v.quizScore + '%'),
      row('Status', v.status || 'Pendente'),
    '</table>',
  ].join('');
}

function htmlForVisitor_(v) {
  const body =
    '<p>Olá <strong>'+v.nome+'</strong>,</p>' +
    '<p>Recebemos sua solicitação de visita. Seu protocolo é <strong style="color:#FF6B00;">'+v.id+'</strong>. Em breve o host responsável fará a validação.</p>' +
    detailsTable_(v) +
    safetyBlockHtml_() +
    '<p style="margin-top:20px;color:#64748b;font-size:13px;">Em caso de dúvidas, responda este e-mail.</p>';
  return shell_('Solicitação de visita recebida', body);
}

function htmlForHost_(v) {
  const body =
    '<p>Olá,</p>' +
    '<p>Você foi indicado como host de uma nova visita. Avalie a solicitação abaixo:</p>' +
    detailsTable_(v) +
    '<p style="margin:14px 0 0;"><strong>Motivo da visita:</strong><br>'+v.motivo+'</p>' +
    safetyBlockHtml_();
  return shell_('Nova solicitação de visita', body);
}