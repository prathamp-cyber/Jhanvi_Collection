import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

// STARTUP ENVIRONMENT VALIDATION
const requiredEnvs = [
    'MONGODB_URI',
    'JWT_SECRET',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD',
    'CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
];

for (const envName of requiredEnvs) {
    if (!process.env[envName]) {
        console.error(`Missing required environment variable: ${envName}`);
        process.exit(1);
    }
}

const jwtSecretLen = (process.env.JWT_SECRET || '').trim().length;
const adminPassLen = (process.env.ADMIN_PASSWORD || '').trim().length;

if (jwtSecretLen < 32 || adminPassLen < 12) {
    const warningMsg = `Security warning: ${jwtSecretLen < 32 ? 'JWT_SECRET is shorter than 32 characters. ' : ''}${adminPassLen < 12 ? 'ADMIN_PASSWORD is shorter than 12 characters.' : ''}`;
    if (process.env.NODE_ENV === 'production') {
        console.error(warningMsg + ' Exiting in production mode.');
        process.exit(1);
    } else {
        console.warn(warningMsg);
    }
}

// APP CONFIG
const app = express();
const port = process.env.PORT || 4000;

app.set('trust proxy', 1);

connectDB();
connectCloudinary();

// Middlewares
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false
}));

app.use(express.json());

const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;
const allowedOrigins = allowedOriginsEnv
    ? allowedOriginsEnv.split(',').map(o => o.trim()).filter(Boolean)
    : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Api Endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.get('/', (req, res) => {
    res.send("Api Working");
});

// Global error handler (converts errors like multer upload errors to JSON)
app.use((err, req, res, next) => {
    if (err) {
        return res.status(400).json({ success: false, message: err.message || 'An unexpected error occurred' });
    }
    next();
});

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});