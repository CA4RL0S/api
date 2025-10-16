import New from '../models/New.js';

export const get = async (request, response) => {
    try {
        const { titulo, activo } = request.query;
        const filters = {};
        if (titulo) filters.titulo = new RegExp(titulo, 'i');
        if (activo) filters.activo = activo;

        const news = await New.find(filters)
            .populate('categoria_id', 'nombre descripcion')
            .populate('estado_id', 'nombre abreviacion')
            .populate({
                path: 'usuario_id',
                select: 'nick nombre', 
                populate: {
                    path: 'perfil_id',
                    select: 'nombre' 
                }
            });

        response.json(news);
    } catch (err) {
        console.log(err)
        response.status(500).send('Error consultando las noticias');
    }
};

export const getById = async (request, response) => {
    try {
        const singleNew = await New.findById(request.params.id)
            .populate('categoria_id', 'nombre')
            .populate('estado_id', 'nombre')
            .populate({
                path: 'usuario_id',
                select: 'nick nombre',
                populate: {
                    path: 'perfil_id',
                    select: 'nombre'
                }
            });

        if (singleNew) {
            response.json(singleNew);
        } else {
            response.status(404).send('Noticia no encontrada');
        }
    } catch (err) {
        response.status(500).send('Error al consultar la noticia');
    }
};

export const create = async (request, response) => {
    try {
        const newNotice = await New.create(request.body);
        response.status(201).json(newNotice);
    } catch (err) {
        console.error("Error al crear noticia:", err.message);
        response.status(500).send('Error al crear el registro');
    }
};

export const update = async (request, response) => {
    try {
        const updatedNotice = await New.findByIdAndUpdate(request.params.id, request.body, { new: true });
        if (updatedNotice) {
            response.status(200).json(updatedNotice);
        } else {
            response.status(404).send('Noticia no encontrada para actualizar');
        }
    } catch (err) {
        console.error("Error al actualizar noticia:", err.message);
        response.status(500).send('Error al actualizar');
    }
};

export const destroy = async (request, response) => {
    try {
        const deletedNotice = await New.findByIdAndDelete(request.params.id);
        if (deletedNotice) {
            response.status(200).send('Noticia eliminada exitosamente');
        } else {
            response.status(404).send('Noticia no encontrada para eliminar');
        }
    } catch (err) {
        console.error("Error al eliminar noticia:", err.message);
        response.status(500).send('Error al eliminar');
    }
};