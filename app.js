import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import profile_routes from './routes/ProfileRoute.js';
import state_routes from './routes/StateRoute.js';
import category_routes from './routes/CategoryRoute.js';
import new_routes from './routes/NewRoute.js';
import user_routes from './routes/UserRoute.js';
import auth_routes from './routes/AuthRoute.js';

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
    console.log('--- Nueva Petición Recibida ---');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Método:', req.method);
    console.log('URL:', req.url);
    console.log('Body recibido:', req.body);
    console.log('------------------------------');
    next(); 
});

app.use('/api', auth_routes);
app.use('/api', profile_routes);
app.use('/api', state_routes);
app.use('/api', category_routes);
app.use('/api', new_routes);
app.use('/api', user_routes);

app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});

export default app;