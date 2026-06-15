const express = require("express");
const db = require("../db");
const { gerarHashSenha, verificarSenha, gerarToken } = require("../auth");

const router = express.Router();

router.post("/registrar", (req, res) => {
  const { usuario, senha } = req.body || {};

  if (!usuario || usuario.length < 3 || !senha || senha.length < 6) {
    return res
      .status(400)
      .json({ erro: "Informe usuário (mín. 3 caracteres) e senha (mín. 6)." });
  }

  const existe = db.prepare("SELECT id FROM contas WHERE usuario = ?").get(usuario);
  if (existe) {
    return res.status(409).json({ erro: "Usuário já existe." });
  }

  const info = db
    .prepare("INSERT INTO contas (usuario, senha_hash) VALUES (?, ?)")
    .run(usuario, gerarHashSenha(senha));

  res.status(201).json({ id: Number(info.lastInsertRowid), usuario });
});

router.post("/login", (req, res) => {
  const { usuario, senha } = req.body || {};

  const conta = db.prepare("SELECT * FROM contas WHERE usuario = ?").get(usuario || "");
  if (!conta || !verificarSenha(senha || "", conta.senha_hash)) {
    return res.status(401).json({ erro: "Usuário ou senha inválidos." });
  }

  res.json({ access_token: gerarToken(conta.usuario), token_type: "bearer" });
});

module.exports = router;
