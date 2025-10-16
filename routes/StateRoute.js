import express from 'express';
import { get, getById, create, update, destroy } from '../controllers/StateController.js';
import { validatorStateRequire, validatorStateOptional } from '../validators/StateValidator.js';
import { authenticateAdmin } from '../middlewares/jwt.js';

const api = express.Router();

api.get('/states', get);
api.get('/states/:id', getById);
api.post('/states', authenticateAdmin, validatorStateRequire, create);
api.put('/states/:id', authenticateAdmin, validatorStateOptional, update);
api.delete('/states/:id', authenticateAdmin, destroy);

export default api;