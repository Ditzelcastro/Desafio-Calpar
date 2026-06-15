require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,

  databaseFile: process.env.DATABASE_FILE || "./calpar.db",

  externalApiUrl:
    process.env.EXTERNAL_API_URL ||
    "https://09441c3d-9208-4fa9-a576-ba237af6b17c.mock.pstmn.io/",

  externalApiSuccessMessage:
    process.env.EXTERNAL_API_SUCCESS_MESSAGE || "Sucesso ao Encontrar usuário.",

  secretKey: process.env.SECRET_KEY || "troque-esta-chave-em-producao",
  tokenExpiresIn: process.env.TOKEN_EXPIRES_IN || "1h",
};
