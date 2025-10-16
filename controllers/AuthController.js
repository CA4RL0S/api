import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Profile from '../models/Profile.js';
import { validationResult } from 'express-validator';

export const login = async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.mapped() });
    }

    const { correo, contraseña } = request.body;

    try {
        const user = await User.findOne({ correo: correo });
        if (!user) {
            return response.status(401).json({ message: "Sin autorización: Credenciales incorrectas" });
        }

        const isMatch = await bcrypt.compare(contraseña, user.contraseña);
        if (!isMatch) {
            return response.status(401).json({ message: "Sin autorización: Credenciales incorrectas" });
        }
        
        const payload = {
            usuario: {
                id: user._id,
                nombre: user.nombre,
                nick: user.nick,
                perfil_id: user.perfil_id
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
        response.status(200).json({ message: "Login con éxito", token: token });

    } catch (err) {
        response.status(500).send('Error en el servidor');
    }
};

export const register = async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.mapped() });
    }
    
    try {
        const defaultProfile = await Profile.findOne({ nombre: 'Contribuidor' });

        if (!defaultProfile) {
            return response.status(500).send('Error: El perfil por defecto "Contribuidor" no fue encontrado.');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(request.body.contraseña, salt);

        const newUser = await User.create({
            ...request.body,
            contraseña: hashedPassword,
            perfil_id: defaultProfile._id, 
            activo: true
        });
        
        response.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        response.status(500).send('Error al crear el usuario');
    }
};