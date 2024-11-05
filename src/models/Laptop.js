const db = require("../config/db");

class Laptop {
  static async create(laptopDTO) {
    const { description, state_id, serial } = laptopDTO;
    try {
      const [result] = await db.execute(
        "INSERT INTO laptops (description, state_id, serial) VALUES (?, ?, ?)",
        [description, state_id, serial]
      );
      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  static async update(id, { description, state_id, serial }) {
    try {
      const [result] = await db.execute(
        `UPDATE laptops SET description = ?, state_id = ?, serial = ? WHERE id = ?`,
        [description, state_id, serial, id]
      );
      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const [rows] = await db.execute("SELECT * FROM laptops");
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Error al buscar los portatiles:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute(`DELETE FROM laptops WHERE id = ?`, [
        id,
      ]);
      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}

module.exports = Laptop;
