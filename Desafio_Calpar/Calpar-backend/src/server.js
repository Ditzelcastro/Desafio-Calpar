const express = require("express");
const swaggerUi = require("swagger-ui-express");

const config = require("./config");
require("./db");
const swaggerSpec = require("./swagger");

const authRoutes = require("./routes/authRoutes");
const usuariosRoutes = require("./routes/usuariosRoutes");
const syncRoutes = require("./routes/syncRoutes");

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/sincronizar", syncRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => res.json({ status: "ok", docs: "/docs" }));

app.listen(config.port, () => {
  console.log(`\n  API rodando em  http://localhost:${config.port}`);
  console.log(`  Swagger         http://localhost:${config.port}/docs\n`);
});
