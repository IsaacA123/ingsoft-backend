const db = require('./db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createTables = async () => {
  try {
    // Tabla de usuarios
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('SUPERADMIN', 'ADMIN', 'STUDENT') NOT NULL DEFAULT 'STUDENT'
      )
    `);

    // Tabla de códigos de verificación
    await db.execute(`
      CREATE TABLE IF NOT EXISTS verification_codes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        verification_code VARCHAR(64) NOT NULL,
        expiration DATETIME NOT NULL,
        UNIQUE (email, verification_code)
      )
    `);
    // Tabla de estados de los portatiles
    await db.execute(`
      CREATE TABLE IF NOT EXISTS laptop_states (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description VARCHAR(255)
      )
    `);

    // Tabla de portátiles
    await db.execute(`
      CREATE TABLE IF NOT EXISTS laptops (
        id INT AUTO_INCREMENT PRIMARY KEY,
        serial VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        state_id INT DEFAULT 1,
        FOREIGN KEY (state_id) REFERENCES laptop_states(id)
      )
    `);

    // Tabla de estados de una reserva
    await db.execute(`
      CREATE TABLE IF NOT EXISTS reservation_states (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description VARCHAR(255)
      )
    `);

    // Tabla de reservas
    await db.execute(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        state_id INT DEFAULT 1,
        reservation_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        reserved_by_user_id INT,
        laptop_id INT NOT NULL,
        FOREIGN KEY (state_id) REFERENCES reservation_states(id),
        FOREIGN KEY (reserved_by_user_id) REFERENCES users(id),
        FOREIGN KEY (laptop_id) REFERENCES laptops(id)
      )
    `);

    // Tabla de multas
    await db.execute(`
      CREATE TABLE IF NOT EXISTS fines (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        end_date DATE NOT NULL,
        user_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log("Tablas creadas o verificadas correctamente");

    createSuperAdmin()
    createDefaultLaptopState()
    createDefaultReservationState()

  } catch (error) {
    console.error("Error creando las tablas:", error.message);
  }
};



async function createSuperAdmin(){
  try{
    const email = process.env.SADMIN_INITIAL_EMAIL || "admin@example.com";
    const passwordHash = await bcrypt.hash(process.env.SADMIN_INITIAL_PASS || "admin", 10);
    await db.execute('INSERT IGNORE INTO users (id, email, password, role) VALUES (?, ?, ?, ?)', [1, email, passwordHash, 'SUPERADMIN']);
    console.log("Usuario SUPERADMIN creado o validado exitosamente.");
  } catch (error) {
    console.error("Error al crear el SUPERADMIN:", error);
  } 
}
async function createDefaultLaptopState(){
  try{
    await db.execute('INSERT IGNORE INTO laptop_states (id, name, description) VALUES (?, ?, ?)', [1, "DEFAULT", 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.']);
    console.log("Estado por defecto para los portatiles creado o validado exitosamente.");
  } catch (error) {
    console.error("Error al crear estado por defecto para los portatiles.", error);
  } 
}

async function createDefaultReservationState(){
  try{
    await db.execute('INSERT IGNORE INTO reservation_states (id, name, description) VALUES (?, ?, ?)', [1, "DEFAULT", 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.']);
    console.log("Estado por defecto para las reservas creado o validado exitosamente.");
  } catch (error) {
    console.error("Error al crear el estado por defecto para las reservas.", error);
  } 
}

module.exports = createTables;
