import jwt from 'jsonwebtoken';

const getTokenFromHeader = (req) => {
    const authorization_header = req.headers.authorization;
    if (authorization_header && authorization_header.startsWith('Bearer ')) {
        return authorization_header.split(' ')[1];
    }
    return null;
};

export const authenticateAdmin = (req, res, next) => {
    const token = getTokenFromHeader(req);
    if (!token) {
        return res.status(401).send({ message: 'No se proporcionó un token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // --- AQUÍ ESTÁ LA CORRECCIÓN ---
        // Comprueba si el perfil en el token es "Administrador"
        if (decoded.usuario.perfil === 'Administrador') {
            req.user = decoded.usuario;
            next();
        } else {
            return res.status(403).send({ message: 'Sin autorización: Se requiere rol de Administrador' });
        }
    } catch (err) {
        return res.status(401).send({ message: 'Token no válido o expirado' });
    }
};

export const authenticateAny = (req, res, next) => {
    const token = getTokenFromHeader(req);
    if (!token) {
        return res.status(401).send({ message: 'No se proporcionó un token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.usuario; 
        next();
    } catch (err) {
        return res.status(401).send({ message: 'Token no válido o expirado' });
    }
};