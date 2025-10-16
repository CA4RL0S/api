import express from 'express';
import { get, getById, create, update, destroy } from '../controllers/CategoryController.js';
import { authenticateAdmin } from '../middlewares/jwt.js';
import { validatorCategoryCreate, validatorCategoryUpdate } from '../validators/CategoryValidator.js';

const api = express.Router();

api.get('/categories', get);
api.get('/categories/:id', getById);
api.post('/categories', authenticateAdmin, validatorCategoryCreate, create);
api.put('/categories/:id', authenticateAdmin, validatorCategoryUpdate, update);
api.delete('/categories/:id', authenticateAdmin, destroy);

export default api;