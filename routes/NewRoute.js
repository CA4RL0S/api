import express from 'express';
import { get, getById, create, update, destroy } from '../controllers/NewController.js';
import { authenticateAdmin, authenticateAny } from '../middlewares/jwt.js';
import { validatorNewCreate, validatorNewUpdate } from '../validators/NewValidator.js';

const api = express.Router();

api.get('/news', get);
api.get('/news/:id', getById);
api.post('/news', authenticateAny, validatorNewCreate, create);
api.put('/news/:id', authenticateAny, validatorNewUpdate, update);
api.delete('/news/:id', authenticateAny, destroy);

export default api;