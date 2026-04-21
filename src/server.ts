import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import projectRoutes from "./routes/projectRoutes"
import authRoutes from "./routes/authRoutes"
import cors from 'cors'
import { corsConfig } from "./config/cors";
import morgan from "morgan";
import { serverErrorHandler } from "./middleware/errorHandler";


dotenv.config();
connectDB();

export const app = express()



app.use(morgan('dev'))

app.use(cors(corsConfig));

app.use(express.json())

app.use('/api/projects', projectRoutes)
app.use('/api/auth', authRoutes)
app.use(serverErrorHandler)