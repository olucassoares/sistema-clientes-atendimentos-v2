const express = require("express");
const cors = require("cors");
require("dotenv").config();

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