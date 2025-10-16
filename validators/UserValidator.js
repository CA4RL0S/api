import { check } from 'express-validator';
import User from '../models/User.js';
import Profile from '../models/Profile.js';

export const validatorUserCreate = [
    check('nombre')
        .notEmpty().withMessage('El campo nombre es obligatorio')
        .isString().withMessage('El campo nombre debe ser texto')
        .isLength({ min: 2, max: 100 }).withMessage('El campo debe tener entre 2 y 100 caracteres'),

    check('apellidos')
        .notEmpty().withMessage('El campo apellidos es obligatorio')
        .isString().withMessage('El campo apellidos debe ser texto')
        .isLength({ min: 2, max: 100 }).withMessage('El campo debe tener entre 2 y 100 caracteres'),

    check('nick')
        .notEmpty().withMessage('El campo nick es obligatorio')
        .isString().withMessage('El campo nick debe ser texto')
        .isLength({ min: 2, max: 20 }).withMessage('El campo debe tener entre 2 y 20 caracteres')
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
                throw new Error('Ya existe un usuario con el mismo correo');
            }
        }),

    check('contraseña')
        .notEmpty().withMessage('El campo contraseña es obligatorio')
        .isString().withMessage('El campo contraseña debe ser texto')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres'),
    

    check('perfil_id')
        .notEmpty().withMessage('El campo perfil_id es obligatorio')
        .isMongoId().withMessage('El ID del perfil no es un ID de Mongo válido')
        .custom(async (value) => {
            const profile = await Profile.findById(value);
            if (!profile) {
                throw new Error('El perfil especificado no existe');
            }
        }),
];

export const validatorUserUpdate = [
    check('nombre')
        .optional()
        .isString().withMessage('El campo nombre debe ser texto')
        .isLength({ min: 2, max: 100 }).withMessage('El campo debe tener entre 2 y 100 caracteres'),

    check('apellidos')
        .optional()
        .isString().withMessage('El campo apellidos debe ser texto')
        .isLength({ min: 2, max: 100 }).withMessage('El campo debe tener entre 2 y 100 caracteres'),

    check('nick')
        .optional()
        .isString().withMessage('El campo nick debe ser texto')
        .isLength({ min: 2, max: 20 }).withMessage('El campo debe tener entre 2 y 20 caracteres')
        .custom(async (value, { req }) => {
            const user = await User.findOne({ nick: value, _id: { $ne: req.params.id } });
            if (user) {
                throw new Error('Este nick ya está en uso por otro usuario');
            }
        }),

    check('perfil_id')
        .optional()
        .isMongoId().withMessage('El ID del perfil no es un ID de Mongo válido')
        .custom(async (value) => {
            const profile = await Profile.findById(value);
            if (!profile) {
                throw new Error('El perfil especificado no existe');
            }
        }),
];