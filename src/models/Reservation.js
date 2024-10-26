const db = require('../config/db'); 
const Joi = require('joi');

const reservationSchema = Joi.object({
    state: Joi.string().valid('ESTADO R1', 'ESTADO R2', 'ESTADO R3').required(),
    reservation_date: Joi.date().required(),
    start_time: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    end_time: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    reserved_by_user_id: Joi.number().integer().optional(),
    laptop_id: Joi.number().integer().required(),
});
const reservationStatusSchema = Joi.object({
  state: Joi.string().valid('ESTADO R1', 'ESTADO R2', 'ESTADO R3').required()
});

class Reservation {

  static async create({ state, reservation_date, start_time, end_time, reserved_by_user_id, laptop_id }) {
    const { error } = reservationSchema.validate({ state, reservation_date, start_time, end_time, reserved_by_user_id, laptop_id });
    if (error) { 
        throw new Error(`Validation error: ${error.details[0].message}`);
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO reservations (state, reservation_date, start_time, end_time, reserved_by_user_id, laptop_id) VALUES (?, ?, ?, ?, ?, ?)',
            [state, reservation_date, start_time, end_time, reserved_by_user_id, laptop_id]
        );
        return result;
    } catch (error) {
        console.error('error al crear la reserva:', error);
        throw error;
    }
  }

    static async findById(reservationId) {
      try {
        const [result] = await db.execute('SELECT * FROM reservations WHERE id = ?', [reservationId]);
        
        if (result.length === 0) {
            throw new Error('Reserva no encontrada');
        }
        return result[0];
      } catch (error) {
          console.error('error al buscar la reserva:', error);
          throw error;
      }
    }


    static async updateState(reservationId, { state }) {
      const { error } = reservationStatusSchema.validate({ state });
      if (error) {
          return res.status(400).json({ message: `Error de validación: ${error.details[0].message}` });
      }
        try {
            const [result] = await db.execute(`UPDATE reservations SET state WHERE id = ?`, reservationId);
            return result;
        } catch (error) {
            console.error('erroror al actualizar el estado de la reserva:', error);
            throw error;
        }
    }

    static async delete(reservationId) {
        try {
            const [result] = await db.execute('DELETE FROM reservations WHERE id = ?', [reservationId]);
            return result;
        } catch (error) {
            console.error('error al eliminar la reserva:', error);
            throw error;
        }
    }

    static async findAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM reservations');
            return rows;
        } catch (error) {
            console.error('error al obtener reservas:', error);
            throw error;
        }
    }

    static async findByUser(userId) {
      try {
          const [rows] = await db.execute('SELECT * FROM reservations WHERE reserved_by_user_id = ?', [userId]);
          return rows;
      } catch (error) {
          console.error('erroror al obtener reservas:', error);
          throw error;
      }
  }
}

module.exports = Reservation;
