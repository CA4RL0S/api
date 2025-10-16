import express from 'express';
import { get, getById, create, update, destroy } from '../controllers/UserController.js';
import { authenticateAdmin } from '../middlewares/jwt.js';
import { validatorUserCreate, validatorUserUpdate } from '../validators/UserValidator.js';

const api = express.Router();

api.get('/users', authenticateAdmin, get);
api.get('/users/:id', authenticateAdmin, getById);
//api.post('/users', authenticateAdmin, validatorUserCreate, create);
api.post('/users', validatorUserCreate, create);
api.put('/users/:id', authenticateAdmin, validatorUserUpdate, update);
api.delete('/users/:id', authenticateAdmin, destroy);

export default api;