import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password)
            return res.status(400).json({ message: "All feilds are required" });

        const existingUser = await User.findOne({ email });

        if (existingUser)
            return res.status(409).json({ message: "User already exists with this email" })

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            username, email, password: hashedPassword
        });

        const savedUser = await user.save();

        const token = jwt.sign({
            userId: savedUser._id,
            email: savedUser.email,
        }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({ message: "User registered successfully", token: token });
    } catch (err) {
        res.status(500).json({
            message: "Iternal server error",
            error: err.message
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: "All feilds are required" });

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(401).json({ message: "Invalid email or password" });

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
        }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({ message: "User login successfully", token: token });
    } catch (err) {
        res.status(500).json({
            message: "Iternal server error",
            error: err.message
        })
    }
}