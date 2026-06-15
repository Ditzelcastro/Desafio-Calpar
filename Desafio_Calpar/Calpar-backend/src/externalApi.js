const config = require("./config");
const db = require("./db");

function getCI(obj, ...chaves) {
  if (!obj || typeof obj !== "object") return undefined;
  const minusculas = {};
  for (const k of Object.keys(obj)) minusculas[k.toLowerCase()] = obj[k];
  for (const c of chaves) {
    if (c.toLowerCase() in minusculas) return minusculas[c.toLowerCase()];
  }
  return undefined;
}

function extrairNome(item) {
  const v = getCI(item, "Nome", "name", "usuario", "username");
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function extrairDisponivel(item) {
  const v = getCI(item, "Disponivel", "disponibilidade", "available", "ativo");
  if (typeof v === "boolean") return v;
  if (typeof v === "string")
    return ["true", "1", "sim", "disponivel", "disponível"].includes(
      v.trim().toLowerCase()
    );
  if (typeof v === "number") return Boolean(v);
  return true;
}

async function buscarDadosApi() {
  let resposta;
  try {
    resposta = await fetch(config.externalApiUrl);
  } catch (e) {
    throw new Error(`Falha ao acessar a API externa: ${e.message}`);
  }

  if (!resposta.ok) {
    throw new Error(`API externa respondeu com status ${resposta.status}.`);
  }

  let payload;
  try {
    payload = await resposta.json();
  } catch {
    throw new Error("A API externa não retornou um JSON válido.");
  }

  const mensagem = getCI(payload, "Msg", "message", "mensagem", "status") || "";
  if (mensagem !== config.externalApiSuccessMessage) {
    throw new Error(
      `Mensagem inesperada da API externa: '${mensagem || "sem mensagem"}'. ` +
        `Esperado: '${config.externalApiSuccessMessage}'.`
    );
  }

  const lista = getCI(payload, "Dados", "data", "usuarios", "results", "users");
  return Array.isArray(lista) ? lista : [];
}

async function sincronizar() {
  const itens = await buscarDadosApi();

  const buscar = db.prepare("SELECT id FROM usuarios WHERE nome = ?");
  const inserir = db.prepare(
    "INSERT INTO usuarios (nome, disponivel) VALUES (?, ?)"
  );
  const atualizar = db.prepare(
    "UPDATE usuarios SET disponivel = ?, atualizado_em = datetime('now') WHERE id = ?"
  );

  let importados = 0;
  let atualizados = 0;

  db.exec("BEGIN");
  try {
    for (const item of itens) {
      const nome = extrairNome(item);
      if (!nome) continue;
      const disponivel = extrairDisponivel(item) ? 1 : 0;

      const existente = buscar.get(nome);
      if (existente) {
        atualizar.run(disponivel, existente.id);
        atualizados++;
      } else {
        inserir.run(nome, disponivel);
        importados++;
      }
    }
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }

  const total = Number(db.prepare("SELECT COUNT(*) AS c FROM usuarios").get().c);
  return { importados, atualizados, total_no_banco: total };
}

module.exports = { sincronizar, buscarDadosApi };
