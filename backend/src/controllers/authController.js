const jwt = require("jsonwebtoken");

const pool = require("../config/database");
const { verifyPassword } = require("../utils/password");

async function login(request, response, next) {
  try {
    const email =
      typeof request.body.email === "string"
        ? request.body.email.trim().toLowerCase()
        : "";

    const password =
      typeof request.body.password === "string"
        ? request.body.password
        : "";

    if (!email || !password) {
      return response.status(400).json({
        message: "E-mail e senha são obrigatórios",
      });
    }

    const result = await pool.query(
      `
        SELECT
          id,
          name,
          email,
          password_hash,
          role
        FROM users
        WHERE LOWER(email) = $1
        LIMIT 1
      `,
      [email],
    );

    const user = result.rows[0];

    if (!user) {
      return response.status(401).json({
        message: "E-mail ou senha inválidos",
      });
    }

    const passwordIsValid = await verifyPassword(
      password,
      user.password_hash,
    );

    if (!passwordIsValid) {
      return response.status(401).json({
        message: "E-mail ou senha inválidos",
      });
    }

    const token = jwt.sign(
      {
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        subject: String(user.id),
        issuer: "sistema-clientes-api",
        audience: "sistema-clientes-frontend",
        expiresIn: "8h",
      },
    );

    return response.status(200).json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};