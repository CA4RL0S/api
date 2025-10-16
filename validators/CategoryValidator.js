import { check } from 'express-validator';
import Category from '../models/Category.js'; 

export const validatorCategoryCreate = [
    check('nombre')
        .notEmpty().withMessage('El campo nombre es obligatorio')
        .isString().withMessage('El campo nombre debe ser texto')
        .isLength({ min: 3, max: 50 }).withMessage('El campo nombre debe tener entre 3 y 50 caracteres')
        .custom(async (value) => {
            const category = await Category.findOne({ nombre: value });
            if (category) {
                throw new Error('Ya existe una categoría con este nombre');
            }
        }),

    check('descripcion')
        .notEmpty().withMessage('El campo descripcion es obligatorio')
        .isString().withMessage('El campo descripcion debe ser texto')
        .isLength({ min: 5, max: 255 }).withMessage('El campo descripcion debe tener entre 5 y 255 caracteres'),
    
    check('activo')
        .optional()
        .isBoolean().withMessage('El campo activo debe ser un valor booleano (true/false)')
];

export const validatorCategoryUpdate = [
    check('nombre')
        .optional()
        .isString().withMessage('El campo nombre debe ser texto')
        .isLength({ min: 3, max: 50 }).withMessage('El campo nombre debe tener entre 3 y 50 caracteres')
        .custom(async (value, { req }) => {
            const category = await Category.findOne({ nombre: value, _id: { $ne: req.params.id } });
            if (category) {
                throw new Error('Ya existe otra categoría con este nombre');
            }
        }),

    check('descripcion')
        .optional()
        .isString().withMessage('El campo descripcion debe ser texto')
        .isLength({ min: 5, max: 255 }).withMessage('El campo descripcion debe tener entre 5 y 255 caracteres'),

    check('activo')
        .optional()
        .isBoolean().withMessage('El campo activo debe ser con valor booleano'),
];