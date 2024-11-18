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
      let query = "SELECT laptops.* FROM laptops";
      const queryParams = [];
  
      // Si se pasa el filtro stateId
      if (filters.stateId) {
        query += " WHERE laptops.state_id = ?";
        queryParams.push(filters.stateId);
      }
  
      // Si se pasa el filtro reservationStateId, hacer un JOIN con la tabla reservations
      if (filters.reservationStateId) {
        if (queryParams.length > 0) {
          query += " AND";  // Añadir 'AND' si ya hay otros filtros
        } else {
          query += " WHERE";  // Usar 'WHERE' si es el primer filtro
        }
  
        // Filtro para asegurar que no haya reservas con el estado dado
        query += " NOT EXISTS (SELECT 1 FROM reservations WHERE reservations.state_id = ? AND reservations.laptop_id = laptops.id";
        queryParams.push(filters.reservationStateId);
  
        // Añadir la condición de fechas futuras
        query += " AND (reservations.reservation_date < NOW() AND reservations.start_time < NOW()))";
      }
  
      const [rows] = await db.execute(query, queryParams);
  
      return rows;
    } catch (error) {
      console.error("Error al buscar los portátiles:", error);
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
