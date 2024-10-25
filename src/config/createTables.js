const db = require('./db');

const createTables = async () => {
  try {
    // Tabla de usuarios
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('SUPERADMIN', 'ADMIN', 'STUDENT') NOT NULL DEFAULT 'STUDENT'
      )
    `);
    // Tabla de codigos de verificación
    await db.execute(`
      CREATE TABLE IF NOT EXISTS verification_codes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        verification_code VARCHAR(64) NOT NULL,
        expiration DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de portátiles
    await db.execute(`
      CREATE TABLE IF NOT EXISTS laptops (
        id INT AUTO_INCREMENT PRIMARY KEY,
        description TEXT,
        state ENUM('ESTADO 1', 'ESTADO 2', 'ESTADO 3') NOT NULL DEFAULT 'ESTADO 1'
      )
    `);

    // Tabla de reservas
    await db.execute(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        state ENUM('ESTADO R1', 'ESTADO R2', 'ESTADO R3') NOT NULL DEFAULT 'ESTADO R1',
        reservation_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        user_id INT NOT NULL,
        reserved_by_user_id INT,
        laptop_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
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

    console.log("Tablas creadas o verificadas correctamente!");
  } catch (error) {
    console.error("Error creando las tablas:", error.message);
  }
};

module.exports = createTables;
