import express from "express"
import "dotenv/config"
import cookieParser from "cookie-parser"
import bcrypt from "bcryptjs"
import { v2 as cloudinary } from "cloudinary"

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import postRoutes from './routes/post.routes.js'

import dbConnect from "./db/connectDb.js"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);


app.get(process.env.CHECKROUTE, (req, res) => {
    res.status(200).json({ success: true, message: "Hello World!" });
})


app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
    dbConnect();
})