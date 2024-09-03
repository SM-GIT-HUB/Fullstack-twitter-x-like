import express from "express"
import "dotenv/config"
import cookieParser from "cookie-parser"
import bcrypt from "bcryptjs"

import authRoutes from "./routes/auth.routes.js"
import dbConnect from "./db/connectDb.js"

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);


app.get(process.env.CHECKROUTE, (req, res) => {
    res.status(200).json({ success: true, message: "Hello World!" });
})


app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
    dbConnect();
})