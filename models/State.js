import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const stateSchema = new Schema({
    nombre: { type: String, required: true, unique: true },
    abreviacion: { type: String, required: true, unique: true }
});

const State = model('State', stateSchema);
export default State;