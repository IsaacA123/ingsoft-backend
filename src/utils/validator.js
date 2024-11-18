const Joi = require('joi');


const userSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'El correo electrónico debe ser válido.',
        'string.empty': 'El correo electrónico no puede estar vacío.',
        'any.required': 'El correo electrónico es obligatorio.',
    }),
    password: Joi.string().min(6).max(30).required().messages({
        'string.min': 'La contraseña debe tener al menos 6 caracteres.',
        'string.max': 'La contraseña no puede tener más de 30 caracteres.',
        'string.empty': 'La contraseña no puede estar vacía.',
        'any.required': 'La contraseña es obligatoria.',
    }),
}).required().messages({
    'object.unknown': 'Propiedad desconocida en el objeto de entrada.',
});


const fineSchema = Joi.object({
    name: Joi.string().max(255).required().messages({
        'string.max': 'El nombre no puede tener más de 255 caracteres.',
        'string.empty': 'El nombre no puede estar vacío.',
        'any.required': 'El nombre es obligatorio.',
    }),
    description: Joi.string().allow('', null).messages({
        'string.empty': 'La descripción no puede estar vacía.',
    }),
    end_date: Joi.date().greater('now').required().messages({
        'date.base': 'La fecha de finalización debe ser una fecha válida.',
        'date.greater': 'La fecha de finalización debe ser mayor que la fecha actual.',
        'any.required': 'La fecha de finalización es obligatoria.',
    }),
    user_id: Joi.number().integer().required().messages({
        'number.base': 'El ID de usuario debe ser un número entero.',
        'any.required': 'El ID de usuario es obligatorio.',
    }),
}).required().messages({
    'object.unknown': 'Propiedad desconocida en el objeto de entrada.',
});


const laptopSchema = Joi.object({
    description: Joi.string().required().min(3).max(500).messages({
            'string.empty': 'La descripción no puede estar vacía.',
            'string.min': 'La descripción debe tener al menos 3 caracteres.',
            'string.max': 'La descripción no puede exceder los 500 caracteres.',
            'any.required': 'La descripción es obligatoria.',
        }),
    state_id: Joi.number().integer().min(1).messages({
            'number.base': 'El estado debe ser un número.',
            'number.integer': 'El estado debe ser un número entero.',
            'number.min': 'El estado debe ser mayor a 0.',
        }),
    serial: Joi.string().required().pattern(/^[A-Za-z0-9-]+$/).min(4).max(20).messages({
            'string.empty': 'El número de serie no puede estar vacío.',
            'string.pattern.base': 'El número de serie solo puede contener letras, números y guiones.',
            'string.min': 'El número de serie debe tener al menos 4 caracteres.',
            'string.max': 'El número de serie no puede exceder los 20 caracteres.',
            'any.required': 'El número de serie es obligatorio.',
        }),
}).required().messages({
    'object.unknown': 'Propiedad desconocida en el objeto de entrada.',
});


const reservationSchema = Joi.object({
    reservation_date: Joi.date().required().min('now').messages({
            'date.base': 'La fecha de reserva debe ser una fecha válida.',
            'date.min': 'La fecha de reserva no puede ser en el pasado.',
            'any.required': 'La fecha de reserva es obligatoria.',
        }),
    start_time: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
            'string.pattern.base': 'La hora de inicio debe tener un formato válido (HH:MM).',
            'string.empty': 'La hora de inicio no puede estar vacía.',
            'any.required': 'La hora de inicio es obligatoria.',
        }),
    end_time: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
        .messages({
            'string.pattern.base': 'La hora de finalización debe tener un formato válido (HH:MM).',
            'string.empty': 'La hora de finalización no puede estar vacía.',
            'any.required': 'La hora de finalización es obligatoria.',
        }),
    laptop_id: Joi.number().integer().min(1).required().messages({
            'number.base': 'El ID de la laptop debe ser un número.',
            'number.integer': 'El ID de la laptop debe ser un número entero.',
            'number.min': 'El ID de la laptop debe ser mayor a 0.',
            'any.required': 'El ID de la laptop es obligatorio.',
        }),
}).required().messages({
    'object.unknown': 'Propiedad desconocida en el objeto de entrada.',
});


const stateSchema = Joi.object({
    name: Joi.string().required().min(3).max(50).pattern(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/).messages({
            'string.empty': 'El nombre del estado no puede estar vacío.',
            'string.min': 'El nombre del estado debe tener al menos 3 caracteres.',
            'string.max': 'El nombre del estado no puede exceder los 50 caracteres.',
            'string.pattern.base': 'El nombre solo puede contener letras y espacios.',
            'any.required': 'El nombre del estado es obligatorio.',
        }),
    description: Joi.string().required().min(10).max(200).messages({
            'string.empty': 'La descripción no puede estar vacía.',
            'string.min': 'La descripción debe tener al menos 10 caracteres.',
            'string.max': 'La descripción no puede exceder los 200 caracteres.',
            'any.required': 'La descripción es obligatoria.',
        }),
}).required().messages({
    'object.unknown': 'Propiedad desconocida en el objeto de entrada.',
});

const validateUser = (data) => userSchema.validate(data, { abortEarly: false });
const validateEmail = (email) => {
    return userSchema.extract('email').validate(email, { abortEarly: false });
};
const validatePassword = (password) => {
    return userSchema.extract('password').validate(password, { abortEarly: false });
};
const validateFine = (data) => fineSchema.validate(data, { abortEarly: false });
const validateLaptop = (data) => laptopSchema.validate(data, { abortEarly: false });
const validateReservation = (data) => reservationSchema.validate(data, { abortEarly: false });
const validateState = (data) => stateSchema.validate(data, { abortEarly: false });

module.exports = { 
    validateUser, 
    validateEmail, 
    validatePassword, 
    validateFine, 
    validateLaptop, 
    validateReservation, 
    validateState
};
