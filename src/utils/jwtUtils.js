import jwt from 'jsonwebtoken';

export const verifyToken = async (token) => {
    try {
        return await jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw err;
    }
}