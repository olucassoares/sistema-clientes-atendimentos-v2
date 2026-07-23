const fs = require("node:fs/promises");
const path = require("node:path");
require("dotenv").config();

const pool = require("../config/database");

async function runMigration() {
  const client = await pool.connect();

  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = await fs.readFile(schemaPath, "utf8");

    await client.query("BEGIN");
    await client.query(schema);
    await client.query("COMMIT");

    console.log("Migração concluída com sucesso.");
    console.log("Tabelas criadas: users, clients e tickets.");
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Erro ao executar a migração:");
    console.error(error);

    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();