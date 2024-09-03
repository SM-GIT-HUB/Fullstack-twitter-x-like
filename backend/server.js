import express from "express"
import "dotenv/config"
import authRoutes from "./routes/auth.routes.js"
import dbConnect from "./db/connectDb.js"

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);


app.get(process.env.CHECKROUTE, (req, res) => {
    res.status(200).json({ success: true, message: "Hello World!" });
})


app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
    dbConnect();
})