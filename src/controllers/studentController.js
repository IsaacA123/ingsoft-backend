const User = require('../models/User');

exports.getAll = async (req, res) => {
    try {
      const result = await User.findByRole('STUDENT');
      
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error obteniendo los usuarios' , error: error.message });
    }
};