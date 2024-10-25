const db = require('../config/db');
const Joi = require('joi');

const laptopSchema = Joi.object({
  description: Joi.string().min(6).required(),
  state: Joi.string().valid('ESTADO 1', 'ESTADO 2', 'ESTADO 3').required(),
});


class Laptop {
  static async create({ description, state = "ESTADO 1"}) {
    const { error } = laptopSchema.validate({ description, state });
    if (error) {
      throw new Error(`Error validando los datos: ${error.details[0].message}`);
    }

    try {
      const [result] = await db.execute(
        'INSERT INTO laptops (description, state) VALUES (?, ?)',
        [description, state]
      );
      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const [rows] = await db.execute('SELECT * FROM laptops'); 
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error al buscar los portatiles:', error);
      throw error; 
    }
  }

  static async update(id, { description, state }) {
    const { error } = laptopSchema.validate({ description, state });
    if (error) {
      throw new Error(`Error validando los datos: ${error.details[0].message}`);
    }
    try {
        const [result] = await db.execute(
            `UPDATE laptops SET description = ?, state = ? WHERE id = ?`,
            [description, state, id]
        );
        return result;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute(`DELETE FROM laptops WHERE id = ?`, [id]);
      return result;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
  }

}

module.exports = Laptop;