import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const get = async (request, response) => {
    try {
        const { nombre, apellidos, nick } = request.query;
        const filters = {};
        if (nombre) filters.nombre = new RegExp(nombre, 'i');
        if (apellidos) filters.apellidos = new RegExp(apellidos, 'i');
        if (nick) filters.nick = new RegExp(nick, 'i');

        const users = await User.find(filters)
            .populate('perfil_id', 'nombre'); 
        
        response.json(users);
    } catch (err) {
        response.status(500).send('Error consultando los datos');
    }
};

export const getById = async (request, response) => {
    try {
        const user = await User.findById(request.params.id)
            .populate('perfil_id', 'id nombre');

        if (user) {
            response.json(user);
        } else {
            response.status(404).send('Recurso no encontrado');
        }
    } catch (err) {
        response.status(500).send('Error al consultar el dato');
    }
};

export const create = async (request, response) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(request.body.contraseña, salt);
        const newUserPayload = {
            ...request.body,
            contraseña: hashedPassword
        };

        const newUser = await User.create(newUserPayload);
        response.status(201).json(newUser);

    } catch (err) {
        console.error("Error al crear usuario:", err.message);
        response.status(500).send('Error al crear el registro');
    }
};

export const update = async (request, response) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(request.params.id, request.body, { new: true });
        if (updatedUser) {
            response.status(200).json(updatedUser);
        } else {
            response.status(404).send('Usuario no encontrado para actualizar');
        }
    } catch (err) {
        console.error("Error al actualizar usuario:", err.message);
        response.status(500).send('Error al actualizar');
    }
};

export const destroy = async (request, response) => {
    try {
        const deletedUser = await User.findByIdAndDelete(request.params.id);
        if (deletedUser) {
            response.status(200).send('Usuario eliminado exitosamente');
        } else {
            response.status(404).send('Usuario no encontrado para eliminar');
        }
    } catch (err) {
        console.error("Error al eliminar usuario:", err.message);
        response.status(500).send('Error al eliminar');
    }
};