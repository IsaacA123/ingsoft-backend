const Laptop = require('../models/Laptop');


exports.getAll = async (req, res) => {
    try {
      const result = await Laptop.findAll();
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error obteniendo los portatiles' , error: error.message });
    }
};

exports.createLaptop = async(req, res) => {
    const { description, state } = req.body;
    try {
      const result = await Laptop.create({ description, state });
      res.status(200).json({message: "Laptop creada correctamente", laptopId: result.insertId});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error Creando la Laptop' , error: error.message });
    }
}

exports.updateLaptop = async (req, res) => {
    const { laptopId } = req.params; 
    const { description, state } = req.body; 

    try {
        const result = await Laptop.update(laptopId, { description, state });
        res.status(200).json({ message: 'Laptop actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error actualizando la Laptop', error: error.message });
    }
};

exports.deleteLaptop = async (req, res) => {
    const { laptopId } = req.params; 

    try {
        const result = await Laptop.delete(laptopId);
        res.status(200).json({ message: 'Laptop eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error eliminando la Laptop', error: error.message });
    }
};