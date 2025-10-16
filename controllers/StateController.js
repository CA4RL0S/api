import State from '../models/State.js';
import { validationResult } from 'express-validator';

export const get = async (request, response) => {
    try {
        const { nombre, abreviacion } = request.query;
        const filters = {};

        if (nombre) filters.nombre = new RegExp(nombre, 'i');
        if (abreviacion) filters.abreviacion = new RegExp(abreviacion, 'i');

        const states = await State.find(filters);
        response.json(states);
    } catch (err) {
        console.error("Error al consultar estados:", err.message);
        response.status(500).send('Error consultando los datos');
    }
};

export const getById = async (request, response) => {
    try {
        const state = await State.findById(request.params.id);
        if (state) {
            response.json(state);
        } else {
            response.status(404).send('Recurso no encontrado');
        }
    } catch (err) {
        console.error("Error al consultar estado por ID:", err.message);
        response.status(500).send('Error al consultar el dato');
    }
};

export const create = async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.mapped() });
    }
    try {
        const newState = await State.create(request.body);
        response.status(201).json(newState);
    } catch (err) {
        console.error("Error al crear estado:", err.message);
        response.status(500).send('Error al crear el registro');
    }
};

export const update = async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.mapped() });
    }
    try {
        const updatedState = await State.findByIdAndUpdate(request.params.id, request.body, { new: true });
        if (updatedState) {
            response.status(200).json(updatedState);
        } else {
            response.status(404).send('Recurso no encontrado para actualizar');
        }
    } catch (err) {
        console.error("Error al actualizar estado:", err.message);
        response.status(500).send('Error al actualizar');
    }
};

export const destroy = async (request, response) => {
    try {
        const deletedState = await State.findByIdAndDelete(request.params.id);
        if (deletedState) {
            response.status(200).send('Registro eliminado exitosamente');
        } else {
            response.status(404).send('Recurso no encontrado para eliminar');
        }
    } catch (err) {
        console.error("Error al eliminar estado:", err.message);
        response.status(500).send('Error al eliminar');
    }
};