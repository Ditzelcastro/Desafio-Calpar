const express = require("express");
const { sincronizar } = require("../externalApi");
const { autenticar } = require("../auth");

const router = express.Router();

router.post("/", autenticar, async (req, res) => {
  try {
    const resultado = await sincronizar();
    res.json({ mensagem: "Sincronização concluída com sucesso.", ...resultado });
  } catch (e) {
    res.status(502).json({ erro: e.message });
  }
});

module.exports = router;
