import { check } from 'express-validator';
import State from '../models/State.js';

export const validatorStateRequire = [
    check('nombre')
        .notEmpty().withMessage('El campo nombre es obligatorio')
        .isString().withMessage('El campo nombre debe ser texto')
        .isLength({ min: 2, max: 50 }).withMessage('El campo debe tener entre 2 y 50 caracteres')
        .custom(async (value) => {
            const state = await State.findOne({ nombre: value });
            if (state) {
                throw new Error('Ya existe un estado con el mismo nombre');
            }
        }),

    check('abreviacion')
        .notEmpty().withMessage('El campo abreviacion es obligatorio')
        .isString().withMessage('El campo abreviacion debe ser texto')
        .isLength({ min: 2, max: 5 }).withMessage('El campo debe tener entre 2 y 5 caracteres')
        .custom(async (value) => {
            const state = await State.findOne({ abreviacion: value });
            if (state) {
                throw new Error('Ya existe un estado con la misma abreviación');
            }
        }),
];

export const validatorStateOptional = [
    check('nombre')
        .optional()
        .isString().withMessage('El campo nombre debe ser texto')
        .isLength({ min: 2, max: 50 }).withMessage('El campo debe tener entre 2 y 50 caracteres')
        .custom(async (value, { req }) => {
            const state = await State.findOne({ nombre: value, _id: { $ne: req.params.id } });
            if (state) {
                throw new Error('Ya existe otro estado con el mismo nombre');
            }
        }),

    check('abreviacion')
        .optional()
        .isString().withMessage('El campo abreviacion debe ser texto')
        .isLength({ min: 2, max: 5 }).withMessage('El campo debe tener entre 2 y 5 caracteres')
        .custom(async (value, { req }) => {
            const state = await State.findOne({ abreviacion: value, _id: { $ne: req.params.id } });
            if (state) {
                throw new Error('Ya existe otro estado con la misma abreviación');
            }
        }),
];