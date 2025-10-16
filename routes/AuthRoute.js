import express from 'express';
import { login, register } from '../controllers/AuthController.js';
import { validatorLogin, validatorRegister } from '../validators/AuthValidator.js';

const api = express.Router();

api.post('/auth/login', validatorLogin, login);
api.post('/auth/register', validatorRegister, register); 

export default api;