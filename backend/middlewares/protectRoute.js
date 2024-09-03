import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"


async function protectRoute(req, res, next)
{
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ error: "User not logged in" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(400).json({ error: "Token invalid" });
        }

        const user = await userModel.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        next();
    }
    catch(err) {
        console.log("error in protect route");
        res.status(401).json({ error: "Something went wrong" });
    }
}


export default protectRoute