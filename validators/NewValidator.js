import { check } from 'express-validator';
import Category from '../models/Category.js';
import User from '../models/User.js';
import State from '../models/State.js';

export const validatorNewCreate = [
    check('categoria_id')
        .notEmpty().withMessage('El campo categoria_id es obligatorio')
        .isMongoId().withMessage('El ID de la categoría no es un ID de Mongo válido')
        .custom(async (value) => {
            const category = await Category.findById(value);
            if (!category) {
                throw new Error('La categoría especificada no existe');
            }
        }),

    check('usuario_id')
        .notEmpty().withMessage('El campo usuario_id es obligatorio')
        .isMongoId().withMessage('El ID del usuario no es un ID de Mongo válido')
        .custom(async (value) => {
            const user = await User.findById(value);
            if (!user) {
                throw new Error('El usuario especificado no existe');
            }
        }),

    check('estado_id')
        .notEmpty().withMessage('El campo estado_id es obligatorio')
        .isMongoId().withMessage('El ID del estado no es un ID de Mongo válido')
        .custom(async (value) => {
            const state = await State.findById(value);
            if (!state) {
                throw new Error('El estado especificado no existe');
            }
        }),

    check('titulo')
        .notEmpty().withMessage('El campo titulo es obligatorio')
        .isLength({ min: 2 }).withMessage('El campo titulo debe tener al menos 2 caracteres'),

    check('activo')
        .optional()
        .isBoolean().withMessage('El campo activo debe ser un booleano'),
];


export const validatorNewUpdate = [
    check('categoria_id')
        .optional()
        .isMongoId().withMessage('El ID de la categoría no es un ID de Mongo válido')
        .custom(async (value) => {
            const category = await Category.findById(value);
            if (!category) {
                throw new Error('La categoría especificada no existe');
            }
        }),

    check('usuario_id')
        .optional()
        .isMongoId().withMessage('El ID del usuario no es un ID de Mongo válido')
        .custom(async (value) => {
            const user = await User.findById(value);
            if (!user) {
                throw new Error('El usuario especificado no existe');
            }
        }),

    check('estado_id')
        .optional()
        .isMongoId().withMessage('El ID del estado no es un ID de Mongo válido')
        .custom(async (value) => {
            const state = await State.findById(value);
            if (!state) {
                throw new Error('El estado especificado no existe');
            }
        }),

    check('titulo')
        .optional()
        .isLength({ min: 2 }).withMessage('El campo titulo debe tener al menos 2 caracteres'),

    check('activo')
        .optional()
        .isBoolean().withMessage('El campo activo debe ser un booleano'),
];