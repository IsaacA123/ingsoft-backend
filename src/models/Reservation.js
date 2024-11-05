const db = require("../config/db");


class Reservation {
    static async create(reservationDTO) {
        const { reservation_date, start_time, end_time, reserved_by_user_id, laptop_id, } = reservationDTO;
        try {
            const [result] = await db.execute(
                "INSERT INTO reservations (reservation_date, start_time, end_time, reserved_by_user_id, laptop_id) VALUES (?, ?, ?, ?, ?)",
                [reservation_date, start_time, end_time, reserved_by_user_id, laptop_id,]
            );
            return result;
        } catch (error) {
            console.error("Error al crear la reserva:", error);
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

    static async findAll() {
        try {
            const [rows] = await db.execute("SELECT * FROM reservations");
            return rows;
        } catch (error) {
            console.error("error al obtener reservas:", error);
            throw error;
        }
    }

    static async findByUser(userId) {
        try {
            const [rows] = await db.execute(
                "SELECT * FROM reservations WHERE reserved_by_user_id = ?",
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
