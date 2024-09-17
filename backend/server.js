import path from "path"
import cors from "cors"
import express from "express"
import "dotenv/config"
import cookieParser from "cookie-parser"
import bcrypt from "bcryptjs"
import { v2 as cloudinary } from "cloudinary"

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import postRoutes from "./routes/post.routes.js"
import notificationRoutes from "./routes/notification.routes.js"

import dbConnect from "./db/connectDb.js"
import axios from "axios"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

const corsOptions = {
    origin: [
        process.env.ALLOW_URL
    ],
    credentials: true
}

app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);

app.get(process.env.CHECKROUTE, (req, res) => {
    res.status(200).json({ success: true, message: "Hello World!" });
})


if (process.env.NODE_ENV != 'development')
{
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    })
}


app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
    dbConnect();
})


// setInterval(() => {
//     axios.get(process.env.ALLOW_URL + process.env.CHECKROUTE);
// }, 600000)