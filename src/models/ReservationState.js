const db = require("../config/db");

class ReservationState {
    static async create({ name, description }) {

        try {
            const [result] = await db.execute(
                "INSERT INTO reservation_states (name, description) VALUES (?, ?)",
                [name, description]
            );
            return result;
        } catch (error) {
            console.error("Error al crear el estado de reserva:", error);
            throw error;
        }
    }

    static async findAll() {
        try {
            const [rows] = await db.execute("SELECT * FROM reservation_states");
            return rows;
        } catch (error) {
            console.error("Error al obtener estados de reserva:", error);
            throw error;
        }
    }

    static async findById(stateId) {
        try {
            const [result] = await db.execute(
                "SELECT * FROM reservation_states WHERE id = ?",
                [stateId]
            );

            if (result.length === 0) {
                throw new Error("Estado de reserva no encontrado");
            }
            return result[0];
        } catch (error) {
            console.error("Error al buscar el estado de reserva:", error);
            throw error;
        }
    }

    static async update(stateId, { name, description }) {
        try {
            const [result] = await db.execute(
                "UPDATE reservation_states SET name = ?, description = ? WHERE id = ?",
                [name, description, stateId]
            );
            return result;
        } catch (error) {
            console.error("Error al actualizar el estado de reserva:", error);
            throw error;
        }
    }

    static async delete(stateId) {
        if (stateId === '1') {
            throw new Error("No se puede eliminar el estado de reserva por defecto.");
        }

        try {
            const [result] = await db.execute(
                "DELETE FROM reservation_states WHERE id = ?",
                [stateId]
            );
            return result;
        } catch (error) {
            console.error("Error al eliminar el estado de reserva:", error);
            throw error;
        }
    }
}

module.exports = ReservationState;
