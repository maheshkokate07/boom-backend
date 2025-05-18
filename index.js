import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import videoRoutes from './src/routes/videoRoutes.js';

dotenv.config();
const app = express();

connectDB();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;

app.get("/", (req, res) => {
    res.status(200).json(`Server is running on PORT: ${PORT}`)
});

app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/video/", videoRoutes);

app.listen(5000, () => {
    console.log(`Server is running on PORT: ${PORT}`)
});