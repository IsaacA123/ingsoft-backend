const db = require("../config/db");

class Reservation {
  static async create(reservationDTO) {
    const {
      reservation_date,
      start_time,
      end_time,
      reserved_by_user_id,
      laptop_id,
    } = reservationDTO;
    
    try {
      const [result] = await db.execute(
        "INSERT INTO reservations (reservation_date, start_time, end_time, reserved_by_user_id, laptop_id, state_id) VALUES (?, ?, ?, ?, ?, ?)",
        [reservation_date, start_time, end_time, reserved_by_user_id, laptop_id, 1]
      );
      return result;
    } catch (error) {
      console.error("Error al crear la reserva:", error);
      throw error;
    }
  }
  
static async getByLaptopId(laptopId) {
    try {
      // Consulta para obtener todas las reservas para un laptop específico
      const [rows] = await db.execute(
        `SELECT reservations.*, 
                users.name AS user_name, 
                reservation_states.name AS state_name
         FROM reservations
         LEFT JOIN users ON reservations.reserved_by_user_id = users.id
         LEFT JOIN reservation_states ON reservations.state_id = reservation_states.id
         WHERE reservations.laptop_id = ?`,
        [laptopId]
      );
      return rows;
    } catch (error) {
      console.error("Error al obtener reservas por laptopId:", error);
      throw error;
    }
  }
  
  static async findById(reservationId) {
    try {
      const [result] = await db.execute(
        "SELECT * FROM reservations WHERE id = ?",
        [reservationId]
      );

      if (result.length === 0) {
        throw new Error("Reserva no encontrada");
      }
      return result[0];
    } catch (error) {
      console.error("error al buscar la reserva:", error);
      throw error;
    }
  }
  
 static async findByUser(userId, filters = {}) {
  try {
    // Construir la consulta inicial
    let query = `
      SELECT reservations.*, 
             laptops.description AS laptop_description, 
             users.name AS user_name
      FROM reservations
      LEFT JOIN laptops ON reservations.laptop_id = laptops.id
      LEFT JOIN users ON reservations.user_id = users.id
      WHERE reservations.user_id = ?  -- Filtramos por el userId
    `;
    const queryParams = [userId];

    // Filtrar por laptopId si se pasa
    if (filters.laptopId) {
      query += " AND reservations.laptop_id = ?";
      queryParams.push(filters.laptopId);
    }

    // Filtrar por estado de la reserva si se pasa
    if (filters.stateId) {
      query += queryParams.length > 1 ? " AND" : " WHERE";
      query += " reservations.state_id = ?";
      queryParams.push(filters.stateId);
    }

    // Ejecutar la consulta
    const [rows] = await db.execute(query, queryParams);
    return rows;
  } catch (error) {
    console.error("Error al obtener reservas por usuario:", error);
    throw error;
  }
}
  static async delete(reservationId) {
    try {
      const [result] = await db.execute(
        "DELETE FROM reservations WHERE id = ?",
        [reservationId]
      );
      return result;
    } catch (error) {
      console.error("error al eliminar la reserva:", error);
      throw error;
    }
  }

  static async findAll(filters = {}) {
    try {
      // Construir la consulta inicial
      let query = `
          SELECT reservations.*, 
                 laptops.description AS laptop_description, 
                 reservation_states.name AS state_name
          FROM reservations
          LEFT JOIN laptops ON reservations.laptop_id = laptops.id
          LEFT JOIN reservation_states ON reservations.state_id = reservation_states.id
        `;
      const queryParams = [];

      // Filtrar por laptopId si se pasa
      if (filters.laptopId) {
        query += " WHERE reservations.laptop_id = ?";
        queryParams.push(filters.laptopId);
      }

      // Filtrar por estado de la reserva si se pasa
      if (filters.stateId) {
        if (queryParams.length > 0) {
          query += " AND";
        } else {
          query += " WHERE";
        }
        query += " reservations.state_id = ?";
        queryParams.push(filters.stateId);
      }

      // Ejecutar la consulta
      const [rows] = await db.execute(query, queryParams);
      return rows;
    } catch (error) {
      console.error("Error al obtener reservas:", error);
      throw error;
    }
  }

  static async findByUser(userId) { 
    try {
      const [rows] = await db.execute(
        `SELECT r.*, l.serial, rs.name AS reservation_state_name
         FROM reservations r
         JOIN laptops l ON r.laptop_id = l.id
         JOIN reservation_states rs ON r.state_id = rs.id
         WHERE r.reserved_by_user_id = ? 
         AND r.reservation_date >= CURRENT_DATE`,
        [userId]
      );
      return rows;
    } catch (error) {
      console.error("error al obtener reservas:", error);
      throw error;
    }
}

}
module.exports = Reservation;
