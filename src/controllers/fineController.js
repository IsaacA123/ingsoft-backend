const Fine = require('../models/Fine');
const { authorizeRole } = require('../middlewares/authMiddleware');


exports.create = async (req, res) => {
    const { name, description, end_date, user_id} = req.body;

    try {
        const result = await Fine.create({ name, description, end_date, user_id });
        res.status(201).json({ message: "Multa creada correctamente", fineId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creando la multa', error: error.message });
    }
};

exports.getAll = async (req, res) => {
    const role = req.user.role;
    const userId = req.user.id;
    try {
        const result = (role === 'STUDENT') 
            ? await Fine.findByUser(userId) 
            : await Fine.findAll();
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo las multas', error: error.message });
    }
};

exports.getById = async (req, res) => {
    const {fineId} = req.params;
    const userId = req.user.id;
    
    try {
        const result = await Fine.findById(fineId);
        if(result.user_id != userId){
            authorizeRole(['ADMIN'])(req, res, () => {
                res.status(200).json(result);
            });
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo las multas', error: error.message });
    }
};


exports.deleteFine = async (req, res) => {
    const { fineId } = req.params;

    try {
        await Reservation.delete(fineId);       
        res.status(200).json({ message: 'Reserva eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error eliminando la reserva', error: error.message });
    }
};
