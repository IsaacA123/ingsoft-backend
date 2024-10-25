const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getAll = async (req, res) => {
    try {
      const result = await User.findByRole("ADMIN");
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error obteniendo los usuarios' , error: error.message });
    }
};

exports.createAdmin = async(req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findByEmail(email);

  if (existingUser) {
    return res.status(400).json({ message: 'El correo electrónico ya está registrado, intente con otro' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await User.createAdmin({email, password: passwordHash});
    res.status(200).json({message: "Usuario creado correctamente", userId: result.insertId});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error Creando el usuario' , error: error.message });
  }
}

exports.deleteAdmin = async(req, res) => {
  const { userId }  = req.params;

  try {
    await User.deleteAdmin(userId);
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando el usuario' , error: error.message});
  }
}