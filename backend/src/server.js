const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/database");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.get("/api/health", (request, response) => {
  return response.status(200).json({
    status: "ok",
    message: "API funcionando corretamente",
  });
});

app.get("/api/database-health", async (request, response, next) => {
  try {
    const result = await pool.query(`
      SELECT
        current_database() AS database,
        current_user AS user,
        NOW() AS current_time
    `);

    return response.status(200).json({
      status: "ok",
      message: "PostgreSQL conectado corretamente",
      connection: result.rows[0],
    });
  } catch (error) {
    return next(error);
  }
});

app.use((request, response) => {
  return response.status(404).json({
    message: "Rota não encontrada",
  });
});

app.use((error, request, response, next) => {
  console.error(error);

  return response.status(500).json({
    message: "Erro interno do servidor",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor executando em http://localhost:${PORT}`);
});