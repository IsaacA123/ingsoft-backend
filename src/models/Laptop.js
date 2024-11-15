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

  static async findAll(filters = {}) {
    try {
      let query = "SELECT * FROM laptops";
      const queryParams = [];
  
      if (filters.stateId) {
        query += " WHERE state_id = ?";
        queryParams.push(filters.stateId);
      }
  
      const [rows] = await db.execute(query, queryParams);
  
      return rows;
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
