require("dotenv").config();

const pool = require("../config/database");
const { hashPassword } = require("../utils/password");

async function seedAdmin() {
  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      "Defina ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD no arquivo .env.",
    );
  }

  if (password.length < 8) {
    throw new Error("A senha do administrador deve ter pelo menos 8 caracteres.");
  }

  const passwordHash = await hashPassword(password);

  const result = await pool.query(
    `
      INSERT INTO users (
        name,
        email,
        password_hash,
        role
      )
      VALUES ($1, $2, $3, 'admin')
      ON CONFLICT (email) DO NOTHING
      RETURNING id, name, email, role
    `,
    [name, email, passwordHash],
  );

  if (result.rowCount === 0) {
    console.log("O usuário administrador já existe.");
    return;
  }

  console.log("Usuário administrador criado com sucesso:");
  console.table(result.rows);
}

seedAdmin()
  .catch((error) => {
    console.error("Erro ao criar o administrador:");
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });