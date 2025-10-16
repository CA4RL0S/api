// models/User.js
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    nick: { type: String, required: true, unique: true },
    
    // --- AÑADE ESTAS LÍNEAS ---
    correo: { type: String, required: true, unique: true, lowercase: true },
    contraseña: { type: String, required: true },
    // -------------------------

    perfil_id: { type: Schema.Types.ObjectId, ref: 'Profile', required: true }
});

const User = model('User', userSchema);
export default User;