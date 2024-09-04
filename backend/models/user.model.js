import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        default: "abc@gmail.com"
    },
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    dp: {
        type: String,
        default: ""
    },
    coverImage: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    link: {
        type: String,
        default: ""
    }
},  { timestamps: true })


const userModel = mongoose.model("User", userSchema);


export default userModel