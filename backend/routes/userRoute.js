import express from 'express';
import rateLimit from 'express-rate-limit';
import { loginUser, registerUser, adminLogin } from '../controllers/userController.js';

const userRouter = express.Router();

const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({ success: false, message: "Too many requests, please try again later." });
    }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({ success: false, message: "Too many requests, please try again later." });
    }
});

userRouter.post('/register', authLimiter, registerUser);
userRouter.post('/login', authLimiter, loginUser);
userRouter.post('/admin', adminLimiter, adminLogin);

export default userRouter;