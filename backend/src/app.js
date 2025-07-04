import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import francoRoutes from './routes/franco.routes.js';
import intercambioRoutes from './routes/intercambio.routes.js';
import personalRoutes from "./routes/personal.routes.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/francos', francoRoutes);
app.use('/api/intercambios', intercambioRoutes);
app.use("/api/personal", personalRoutes);




export default app;
