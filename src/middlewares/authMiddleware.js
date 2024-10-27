const jwt = require('jsonwebtoken');
require('dotenv').config();

authMiddleware = (req, res, next) => {
  const token = req.cookies.token; 
  if (!token) return res.status(401).json({ message: 'No se proporcionó un token' });
  
  jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Fallo al autenticar el token, por favor verifique el formato correcto del Bearer token' });
    req.user = decoded;
    next();
  });
};


const authorizeRole = (requiredRoles) => {
  return async (req, res, next) => {
    const role = req.user.role;

    try {
      if (!role || !requiredRoles.includes(role)) {
        return res.status(403).json({ message: 'No tienes permiso para realizar esta acción', requiredRoles, "Su rol es: ": role });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: 'Error verificando el rol del usuario', error });
    }
  };
};

module.exports = { authMiddleware, authorizeRole };
