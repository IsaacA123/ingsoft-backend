const db = require("../config/db");
const { validateFine } = require("../utils/validator");

class Fine {
	static async create(fineDto) {
		const { name, description, end_date, user_id } = fineDto;
		try {
			const [result] = await db.execute("INSERT INTO fines (name, description, end_date, user_id) VALUES (?, ?, ?, ?)", [ name, description, end_date, user_id ]);
			return result;
		} catch (error) {
			console.error("error al crear la multa:", error);
			throw error;
		}
	}

	static async findById(reservationId) {
		try {
			const [result] = await db.execute(
				"SELECT * FROM fines WHERE id = ?",
				[reservationId]
			);

			if (result.length === 0) {
				throw new Error("Multa no encontrada");
			}
			return result[0];
		} catch (error) {
			console.error("error al buscar la multa:", error);
			throw error;
		}
	}

	static async delete(reservationId) {
		try {
			const [result] = await db.execute(
				"DELETE FROM fines WHERE id = ?",
				[reservationId]
			);
			return result;
		} catch (error) {
			console.error("error al eliminar la multa:", error);
			throw error;
		}
	}

	static async findAll() {
		try {
			const [rows] = await db.execute("SELECT * FROM fines");
			return rows;
		} catch (error) {
			console.error("error al obtener las multas:", error);
			throw error;
		}
	}

	static async findByUser(userId) {
		try {
			const [rows] = await db.execute(
				"SELECT * FROM fines WHERE user_id = ?",
				[userId]
			);
			return rows;
		} catch (error) {
			console.error("error al obtener las multas del usuario:", error);
			throw error;
		}
	}
}

module.exports = Fine;
