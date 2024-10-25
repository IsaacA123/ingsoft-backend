const User = require('../models/User');
const {sendVerificationEmail, verifyCode} = require('../config/email'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.sendCode = async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findByEmail(email);

  if (existingUser) {
    return res.status(400).json({ message: 'El correo electrónico ya está registrado, , intente con otro' });
  }

  try {
    await sendVerificationEmail(email);
    res.status(200).json({ message: 'Código de verificación enviado al correo. Verifica tu correo para continuar.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error registrando el usuario' });
  }
};


exports.registerStudent = async (req, res) => {
  const { email, password , code} = req.body;

  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: 'El correo electrónico ya está registrado, , intente con otro' });
  }
  
  try {
    const isValid =  await verifyCode(email, code); 
  
    if (!isValid) {
      return res.status(400).json({ message: 'Código de verificación incorrecto o ha expirado.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.createStudent({ email, password: passwordHash }); 
    const user = await User.findByEmail(email);

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error registrando el usuario', error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'El nombre de usuario no existe en la base de datos' });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error del servidor:' });
  }
};
