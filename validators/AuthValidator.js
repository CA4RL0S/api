import { check } from 'express-validator';
import User from '../models/User.js';

export const validatorLogin = [
    check('correo')
        .notEmpty().withMessage('El campo correo es requerido')
        .isEmail().withMessage('El campo correo debe ser un correo válido'),

    check('contraseña')
        .notEmpty().withMessage('El campo contraseña es requerido'),
];

export const validatorRegister = [
    check('nombre')
        .notEmpty().withMessage('El campo nombre es obligatorio'),
    
    check('apellidos')
        .notEmpty().withMessage('El campo apellidos es obligatorio'),

    check('nick')
        .notEmpty().withMessage('El campo nick es obligatorio')
        .custom(async (value) => {
            const user = await User.findOne({ nick: value });
            if (user) {
                throw new Error('Este nick ya está en uso');
            }
        }),

    check('correo')
        .notEmpty().withMessage('El campo correo es obligatorio')
        .isEmail().withMessage('Debe ser un correo válido')
        .custom(async (value) => {
            const user = await User.findOne({ correo: value });
            if (user) {
                throw new Error('Ya existe un usuario con este correo');
            }
        }),

    check('contraseña')
        .notEmpty().withMessage('El campo contraseña es obligatorio')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres'),
];