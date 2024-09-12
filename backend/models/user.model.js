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
        default: "https://plus.unsplash.com/premium_photo-1677094310956-7f88ae5f5c6b?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    coverImage: {
        type: String,
        default: "https://images.unsplash.com/photo-1591302418462-eb55463b49d6?q=80&w=1851&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    bio: {
        type: String,
        default: "Hey there!"
    },
    link: {
        type: String,
        default: ""
    },
    likedPosts: {
       type: [mongoose.Schema.Types.ObjectId],
       ref: "Post",
       default: []
    }
},  { timestamps: true })


const userModel = mongoose.model("User", userSchema);


export default userModel