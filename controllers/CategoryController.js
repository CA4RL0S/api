import Category from '../models/Category.js';

export const get = async (request, response) => {
    try {
        const { nombre, descripcion, activo, useralta } = request.query;
        const filters = {};

        if (nombre) filters.nombre = new RegExp(nombre, 'i'); 
        if (descripcion) filters.descripcion = new RegExp(descripcion, 'i');
        if (activo) filters.activo = activo;
        if (useralta) filters.useralta = new RegExp(useralta, 'i');

        const categories = await Category.find(filters);
        response.json(categories);
    } catch (err) {
        console.error("Error al consultar categorías:", err.message);
        response.status(500).send('Error consultando los datos');
    }
};

export const getById = async (request, response) => {
    try {
        const category = await Category.findById(request.params.id);
        if (category) {
            response.json(category);
        } else {
            response.status(404).send('Recurso no encontrado');
        }
    } catch (err) {
        console.error("Error al consultar categoría por ID:", err.message);
        response.status(500).send('Error al consultar el dato');
    }
};

export const create = async (request, response) => {
    try {
        const newCategory = await Category.create(request.body);
        response.status(201).json(newCategory);
    } catch (err) {
        console.error("Error al crear categoría:", err.message);
        response.status(500).send('Error al crear el registro');
    }
};

export const update = async (request, response) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(request.params.id, request.body, { new: true });
        if (updatedCategory) {
            response.status(200).json(updatedCategory);
        } else {
            response.status(404).send('Recurso no encontrado para actualizar');
        }
    } catch (err) {
        console.error("Error al actualizar categoría:", err.message);
        response.status(500).send('Error al actualizar');
    }
};

export const destroy = async (request, response) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(request.params.id);
        if (deletedCategory) {
            response.status(200).send('Registro eliminado exitosamente');
        } else {
            response.status(404).send('Recurso no encontrado para eliminar');
        }
    } catch (err) {
        console.error("Error al eliminar categoría:", err.message);
        response.status(500).send('Error al eliminar');
    }
};