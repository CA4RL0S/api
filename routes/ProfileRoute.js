import express from 'express';
import { get, getById, create, update, destroy } from '../controllers/ProfileController.js';

const api = express.Router();

api.get('/profiles', get); 
api.get('/profiles/:id', getById);
api.post('/profiles', create);
api.put('/profiles/:id', update);
api.delete('/profiles/:id', destroy);

export default api;