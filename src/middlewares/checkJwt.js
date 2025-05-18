import { verifyToken } from "../utils/jwtUtils.js";

export const checkJWT = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader)
            return req.status(401).json({ message: "Authorzation header missing" });

        const token = authHeader.replace("Bearer ", "").trim();
        const payload = await verifyToken(token);

        if (!payload) {
            throw new Error("Invalid token");
        }

        req.client = payload;

        next()
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" })
    }
}