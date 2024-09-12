import generateToken from "../lib/utils/generateToken.js"
import userModel from "../models/user.model.js"
import bcrypt from "bcryptjs"

async function signup(req, res)
{
    try {
        const {username, fullName, email, password} = req.body;

        const user = await userModel.findOne({ username });

        if (user) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        //hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userModel.create({
            username,
            fullName,
            email: email? email : "abc@gmail.com",
            password: hashedPassword
        })

        if (newUser)
        {
            generateToken(newUser._id, res);
            res.status(200).json({ _id: newUser._id, username, fullName, email: newUser.email });
        }
        else {
            res.status(500).json({ error: "Couldn't signup" });
        }
    }
    catch(err) {
        console.log(`error in signup: ${err.message}`);
        res.status(500).json({ error: "Something went wrong" });
    }
}


async function login(req, res)
{
    try {
        const {username, password} = req.body;
        
        const user = await userModel.findOne({ username });
        const passwordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !passwordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        generateToken(user._id, res);
        user.password = undefined;

        res.status(200).json( user );
    }
    catch(err) {
        console.log(`error in login: ${err.message}`);
        res.status(500).json({ error: "Something went wrong" });
    }
}


function logout(req, res)
{
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch(err) {
        console.log(`error in logout: ${err.message}`);
        res.status(401).json({ error: "Something went wrong" });
    }
}


function getMe(req, res)
{
    try {
        res.status(201).json(req.user);
    }
    catch(err) {
        console.log(`error in getMe ${err.message}`);
        res.status(500).json({ error: "Something went wrong" });
    }
}


export {signup, login, logout, getMe}