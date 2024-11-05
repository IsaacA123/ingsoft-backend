const db = require("../config/db");


class User {
  static async createAdmin(userDTO) {
    const {email, password} = userDTO;
    try {
      const [result] = await db.execute(
        "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
        [email, password, "ADMIN"]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async createStudent(userDTO) {
    const {email, password} = userDTO;
    try {
      const [result] = await db.execute(
        "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
        [email, password, "STUDENT"]
      );
      return result;
    } catch (error) {
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
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
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
      throw error;
    }
  }

  static async updateUser(id, { email, password }, code) {
    try {
      if (email) {
        return await db.execute(`UPDATE users SET email = ? WHERE id = ?`, [
          email,
          id,
        ]);
      }

      if (password) {
        return await db.execute(`UPDATE users SET password = ? WHERE id = ?`, [
          password,
          id,
        ]);
      }
      throw new Error("No hay email o contraseña que actualizar.");
    } catch (error) {
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
      throw error;
    }
  }
}

module.exports = User;
