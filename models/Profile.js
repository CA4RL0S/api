import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const profileSchema = new Schema({
    nombre: { type: String, required: true, unique: true }
});

const Profile = model('Profile', profileSchema);
export default Profile;