const { verifyCode } = require('../config/email');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getSelf = async (req, res) => {
  const {id, email, role} = req.user;
  try {
    res.status(200).json({id, email, role});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error obteniendo los datos del usuario', error: error.message });
  }
};

exports.changePass = async (req, res) => {
    const { password } = req.body;
    const userId = req.user.id;
    const passwordHash = await bcrypt.hash(password, 10);
    try {
      await User.updateUser(userId, { password: passwordHash });
      res.status(200).json("Contraseña actualizanda correctamente");
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error obteniendo los datos del usuario', error: error.message });
    }
};

exports.changeEmail = async (req, res) => {
  const { email, code } = req.body;
  const userId = req.user.id;
  try {
    const isValid =   await verifyCode(email, code); 
  
    if (!isValid) {
      return res.status(400).json({ message: 'Código de verificación incorrecto o ha expirado.' });
    }

    await User.updateUser(userId, { email }, code);
    res.status(200).json("Correo actualizanda correctamente");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error obteniendo los datos del usuario', error: error.message });
  }
};