import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const newSchema = new Schema({
    titulo: { type: String, required: true },
    activo: { type: Boolean, default: true },
    categoria_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    estado_id: { type: Schema.Types.ObjectId, ref: 'State', required: true },
    usuario_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const New = model('New', newSchema);
export default New;