const User = require('../models/User');
const sendEmail = require('../config/email'); 
const VerificationCode = require('../middlewares/codesMiddleware')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.sendCodeRegister = async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findByEmail(email);

  if (existingUser) {
    return res.status(409).json({ message: 'El correo electrónico ya está registrado, intente con otro' });
  }
  
  try {
    const code = Math.floor(1000 + Math.random() * 9000).toString(); //código de 4 digitos
    const expiration = new Date(Date.now() + 60*60*1000); // 1 hora de expiración
    VerificationCode.ceateCode(email, code, expiration);
    await sendEmail(
      email,
      "Codigo de verificación.",
      `
      <h2>¡Bienvenido! Al sistema de prestamos de portatiles 💻</h2>
      <p>Tu código de verificación es: <strong style="color: blue;">${code}</strong>.</p>
      <p >Este código expira en 1 hora a las ${expiration}</p>
      `
      );
    res.status(200).json({ message: 'Código de verificación enviado al correo. Verifica tu correo para continuar' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el envío del código', error: error.message});
  }
};

exports.sendCodeRecovery = async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findByEmail(email);

  if (!existingUser) {
    return res.status(409).json({ message: 'Este correo no esta registrado en nuestra base de datos' });
  }

  try {
    const expiration = new Date(Date.now() + 30*60*1000); // 30 minutos de expiración
    const code = Math.floor(1000 + Math.random() * 9000).toString(); //código de 4 digitos
    await VerificationCode.ceateCode(email, code, expiration);
    await sendEmail(
      email,
      "Recuperar contraseña.",
      `
      <h2>¡Hola! ¿Estas tratando de cambiar tu contraseña? 🤔 </h2>
      <p> Si no es así ignora este mensaje </p>
      <br>
      <p>Tu código de verificación es: <strong style="color: blue;">${code}</strong>.</p>
      <p >Este código expira en 30 minutos a las ${expiration}</p>
      `
      );
    res.status(200).json({ message: 'Código de verificación enviado al correo. Verifica tu correo para continuar' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el envío del código', error: error.message});
  }
};

exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const isValid =  await VerificationCode.verifyCode(email, code); 
  
    if (!isValid) {
      return res.status(400).json({ message: 'Código de verificación incorrecto o ha expirado' });
    }
    res.status(200).json({ message: 'Código de verificación aceptado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error validando el codigo', error: error.message});
  }
};

exports.registerStudent = async (req, res) => {
  const { email, password , code} = req.body;

  const existingUser = await User.findByEmail(email);

  if (existingUser) {
    return res.status(409).json({ message: 'El correo electrónico ya está registrado, , intente con otro' });
  }
  
  try {
    const isValid =  await VerificationCode.verifyCode(email, code); 
  
    if (!isValid) {
      return res.status(401).json({ message: 'Código de verificación incorrecto o ha expirado.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.createStudent({ email, password: passwordHash }); 
    VerificationCode.deleteCodes(email);
    
    const user = await User.findByEmail(email);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true, 
      maxAge: 3600000 // 1 hora
    });
    res.status(201).json({ message: 'Usuarios registrado con exito!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registrando el usuario', error: error.message});
  }
};

exports.resetPassword = async (req, res) => {
  const { email, password , code} = req.body;

  try {
    const isValid =  await VerificationCode.verifyCode(email, code); 
    if (!isValid) {
      return res.status(401).json({ message: 'Código de verificación incorrecto o ha expirado.' });
    }
    
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'El correo del usuario no existe en la base de datos' });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    await User.updateUser(user.id, { password: passwordHash });
    VerificationCode.deleteCodes(email);

    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error actualizando la contraseña', error: error.message});
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'El correo del usuario no existe en la base de datos' });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true, 
      maxAge: 3600000 // 1 hora
    });

    res.status(200).json({ message: 'Sesión iniciada con exito. ¡Bienvenido!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor:',  error: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token'); 
  res.status(200).json({ message: 'Sesión cerrada con éxito.' });
};

