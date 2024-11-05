const db = require("../config/db");

class LaptopState {
    static async create({ name, description }) {

        try {
            const [result] = await db.execute(
                "INSERT INTO laptop_states (name, description) VALUES (?, ?)",
                [name, description]
            );
            return result;
        } catch (error) {
            console.error("Error al crear el estado de el portatil:", error);
            throw error;
        }
    }

    static async findAll() {
        try {
            const [rows] = await db.execute("SELECT * FROM laptop_states");
            return rows;
        } catch (error) {
            console.error("Error al obtener estados de portatil:", error);
            throw error;
        }
    }

    static async findById(laptopId) {
        try {
            const [result] = await db.execute(
                "SELECT * FROM laptop_states WHERE id = ?",
                [laptopId]
            );

            if (result.length === 0) {
                throw new Error("Estado de portatil no encontrado");
            }
            return result[0];
        } catch (error) {
            console.error("Error al buscar el estado de portatil:", error);
            throw error;
        }
    }

    static async update(laptopId, { name, description }) {
        try {
            const [result] = await db.execute(
                "UPDATE laptop_states SET name = ?, description = ? WHERE id = ?",
                [name, description, laptopId]
            );
            return result;
        } catch (error) {
            console.error("Error al actualizar el estado de laptop:", error);
            throw error;
        }
    }

    static async delete(stateId) {
        if (stateId === '1') {
            throw new Error("No se puede eliminar el estado de laptop por defecto.");
        }

        try {
            const [result] = await db.execute(
                "DELETE FROM laptop_states WHERE id = ?",
                [stateId]
            );
            return result;
        } catch (error) {
            console.error("Error al eliminar el estado de laptop:", error);
            throw error;
        }
    }
}

module.exports = LaptopState;
