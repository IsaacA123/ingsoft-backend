const db = require("../config/db");
const Joi = require("joi");

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

class User {
  static async createAdmin({ email, password }) {
    const { error } = userSchema.validate({ email, password });
    if (error) {
      throw new Error(`Formato no valido: ${error.details[0].message}`);
    }
    try {
      const [result] = await db.execute(
        "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
        [email, password, "ADMIN"]
      );

      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  static async createStudent({ email, password }) {
    const { error } = userSchema.validate({ email, password });
    if (error) {
      throw new Error(`Formato no valido: ${error.details[0].message}`);
    }
    try {
      const [result] = await db.execute(
        "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
        [email, password, "STUDENT"]
      );
      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Error al buscar el usuario:", error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Error al buscar el usuario:", error);
      throw error;
    }
  }

  static async findByRole(role) {
    try {
      const [rows] = await db.execute(
        "SELECT id, email, role FROM users WHERE role = ?",
        [role]
      );
      return rows;
    } catch (error) {
      console.error("Error al buscar usuarios por rol:", error);
      throw error;
    }
  }

  static async updateUser(id, { email, password }, code) {
    try {
      if (email) {
        const { error } = userSchema
          .fork(["password"], (schema) => schema.optional())
          .validate({ email });
        if (error) {
          throw new Error(
            `Error validando el correo: ${error.details[0].message}`
          );
        }
        return await db.execute(`UPDATE users SET email = ? WHERE id = ?`, [
          email,
          id,
        ]);
      }

      if (password) {
        const { error } = userSchema
          .fork(["email"], (schema) => schema.optional())
          .validate({ password });
        if (error) {
          throw new Error(
            `Error validando la contraseña: ${error.details[0].message}`
          );
        }
        return await db.execute(`UPDATE users SET password = ? WHERE id = ?`, [
          password,
          id,
        ]);
      }

      throw new Error("No hay datos que actualizar:");
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  }

  static async deleteAdmin(id) {
    try {
      const [userRows] = await db.execute(
        "SELECT role FROM users WHERE id = ?",
        [id]
      );

      if (userRows.length === 0) {
        throw new Error("Usuario no encontrado.");
      }

      const { role } = userRows[0];

      if (role !== "ADMIN") {
        throw new Error("Solo se puede eliminar usuarios con el rol ADMIN.");
      }

      const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
      return result;
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      throw error;
    }
  }
}

module.exports = User;
