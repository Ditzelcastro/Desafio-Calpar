const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("./config");

function gerarHashSenha(senha) {
  return bcrypt.hashSync(senha, 10);
}

function verificarSenha(senha, hash) {
  return bcrypt.compareSync(senha, hash);
}

function gerarToken(usuario) {
  return jwt.sign({ sub: usuario }, config.secretKey, {
    expiresIn: config.tokenExpiresIn,
  });
}

function autenticar(req, res, next) {
  const header = req.headers.authorization || "";
  const [tipo, token] = header.split(" ");

  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({ erro: "Token não fornecido." });
  }

  try {
    const payload = jwt.verify(token, config.secretKey);
    req.usuario = payload.sub;
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
}

module.exports = { gerarHashSenha, verificarSenha, gerarToken, autenticar };
