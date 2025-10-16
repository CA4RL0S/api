import Profile from '../models/Profile.js';

export const get = async (request, response) => {
    try {
        const { nombre } = request.query;
        const filters = nombre ? { nombre: new RegExp(nombre, 'i') } : {}; 
        const profiles = await Profile.find(filters);
        response.json(profiles);
    } catch (err) {
        response.status(500).send('Error consultando los datos');
    }
};

export const getById = async (request, response) => {
    try {
        const profile = await Profile.findById(request.params.id);
        if (profile) {
            response.json(profile);
        } else {
            response.status(404).send('Recurso no encontrado');
        }
    } catch (err) {
        response.status(500).send('Error al consultar el dato');
    }
};

export const create = async (request, response) => {
    try {
        const newProfile = await Profile.create(request.body);
        response.status(201).json(newProfile);
    } catch (err) {
        response.status(500).send('Error al crear');
    }
};

export const update = async (request, response) => {
    try {
        const updatedProfile = await Profile.findByIdAndUpdate(request.params.id, request.body, { new: true });
        if (updatedProfile) {
            response.status(200).json(updatedProfile);
        } else {
            response.status(404).send('Recurso no encontrado para actualizar');
        }
    } catch (err) {
        response.status(500).send('Error al actualizar');
    }
};

export const destroy = async (request, response) => {
    try {
        const deletedProfile = await Profile.findByIdAndDelete(request.params.id);
        if (deletedProfile) {
            response.status(200).send('Registro eliminado exitosamente');
        } else {
            response.status(404).send('Recurso no encontrado para eliminar');
        }
    } catch (err) {
        response.status(500).send('Error al eliminar');
    }
};