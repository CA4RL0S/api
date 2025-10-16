import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const categorySchema = new Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String },
    activo: { type: Boolean, default: true },
    useralta: { type: String }
});

const Category = model('Category', categorySchema);
export default Category;