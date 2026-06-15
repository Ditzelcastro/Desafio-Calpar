const express = require("express");
const db = require("../db");
const { autenticar } = require("../auth");

const router = express.Router();
router.use(autenticar);

function serializar(u) {
  return {
    id: u.id,
    nome: u.nome,
    disponivel: Boolean(u.disponivel),
    criado_em: u.criado_em,
    atualizado_em: u.atualizado_em,
  };
}

router.post("/", (req, res) => {
  const { nome, disponivel } = req.body || {};
  if (!nome || typeof nome !== "string" || !nome.trim()) {
    return res.status(400).json({ erro: "O campo 'nome' é obrigatório." });
  }
  const disp = disponivel === undefined ? 1 : disponivel ? 1 : 0;

  const info = db
    .prepare("INSERT INTO usuarios (nome, disponivel) VALUES (?, ?)")
    .run(nome.trim(), disp);

  const novo = db.prepare("SELECT * FROM usuarios WHERE id = ?").get(Number(info.lastInsertRowid));
  res.status(201).json(serializar(novo));
});

router.get("/", (req, res) => {
  const linhas = db.prepare("SELECT * FROM usuarios ORDER BY id").all();
  res.json(linhas.map(serializar));
});

router.get("/:id", (req, res) => {
  const u = db.prepare("SELECT * FROM usuarios WHERE id = ?").get(req.params.id);
  if (!u) return res.status(404).json({ erro: "Usuário não encontrado." });
  res.json(serializar(u));
});

router.put("/:id", (req, res) => {
  const u = db.prepare("SELECT * FROM usuarios WHERE id = ?").get(req.params.id);
  if (!u) return res.status(404).json({ erro: "Usuário não encontrado." });

  const nome = req.body?.nome !== undefined ? req.body.nome : u.nome;
  const disponivel =
    req.body?.disponivel !== undefined ? (req.body.disponivel ? 1 : 0) : u.disponivel;

  db.prepare(
    "UPDATE usuarios SET nome = ?, disponivel = ?, atualizado_em = datetime('now') WHERE id = ?"
  ).run(nome, disponivel, u.id);

  res.json(serializar(db.prepare("SELECT * FROM usuarios WHERE id = ?").get(u.id)));
});

router.delete("/:id", (req, res) => {
  const info = db.prepare("DELETE FROM usuarios WHERE id = ?").run(req.params.id);
  if (Number(info.changes) === 0) {
    return res.status(404).json({ erro: "Usuário não encontrado." });
  }
  res.status(204).end();
});

module.exports = router;
