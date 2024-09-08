import bcrypt from "bcryptjs"
import { v2 as cloudinary } from "cloudinary"

import notificationModel from "../models/notification.model.js"
import userModel from "../models/user.model.js"

async function getUserProfile(req, res)
{
    const { username } = req.params;

    try {
        const user = await userModel.find({username}).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    }
    catch(err) {
        console.log(`error in getUserProfile ${err.message}`);
        res.status(401).json({ error: "Something went wrong" });
    }
}


async function followOrUnfollowUser(req, res)
{
    try {
        const { id } = req.params;
        
        if (id == req.user._id) {
            return res.status(400).json({ error: "Can't follow or unfollow yourself" });
        }

        const userToModify = await userModel.findById(id);
        const currUser = await userModel.findById(req.user._id);

        if (!userToModify || !currUser) {
            return res.status(400).json({ error: "User not found" });
        }

        const isFollowed = currUser.following.includes(id);

        if (isFollowed)
        {
            await currUser.updateOne({ $pull: { following: userToModify._id } });
            await userToModify.updateOne({ $pull: { followers: currUser._id} } );

            res.status(200).json({ message: "Unfollowed now" });
        }
        else
        {
            await currUser.updateOne({ $push: { following: userToModify._id } });
            await userToModify.updateOne({ $push: { followers: currUser._id } });

            const notific = await notificationModel.create({
                type: "follow",
                from: currUser._id,
                to: userToModify._id
            })

            res.status(200).json({ message: "Following now" });
        }
    }
    catch(err) {
        console.log(`error in followOrUnfollowUser ${err.message}`);
        res.status(401).json({ error: "Something went wrong" });
    }
}


async function getSuggestedUsers(req, res)
{
    try {
        const userId = req.user._id;

        const myFollowing = await userModel.findById(userId).select("following");

        const users = await userModel.aggregate([
            { $match: { _id: { $ne: userId} } },
            { $sample: { size: 10 } },
            { $project: { password: 0 } }
        ])

        const filteredUsers = users.filter((user) => !myFollowing.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0, 4);

        res.status(200).json( suggestedUsers );
    }
    catch(err) {
        console.log(`error in getSuggestedUsers ${err.message}`);
        res.status(401).json({ error: "Something went wrong "});
    }
}


async function updateUser(req, res)
{
    const { username, email, fullName, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if ( (!currentPassword && newPassword) || (!newPassword && currentPassword) ) {
            return res.status(400).json({ error: "Please provide both current and new passwords"});
        }

        if (currentPassword && newPassword)
        {
            const isMatch = await bcrypt.compare(currentPassword, user.password);

            if (!isMatch) {
                return res.status(400).json({ error: "Incorrect password" });
            }

            if (newPassword.length < 4) {
                return res.status(400).json({ error: "Password must be at least 4 characters" });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if (profileImg)
        {
            if (user.profileImg)
            {
                //getting the id from a cloudinary image url: https://something/anything/id.png
                await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0]);
            }
            
            const uploadedResponse = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadedResponse.secure_url;
        }
        
        if (coverImg)
        {
            if (user.coverImg)
            {
                //getting the id from a cloudinary image url: https://something/anything/id.png
                await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadedResponse.secure_url;
        }

        user.username = username || user.username;
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.dp = profileImg || user.dp;
        user.coverImage = coverImg || user.coverImage;

        await user.save();

        user.password = undefined;

        res.status(200).json(user);
    }
    catch(err) {
        console.log(`error in update user ${err.message}`);
        res.status(401).json({ error: "Something went wrong" });
    }
}


export { getUserProfile, followOrUnfollowUser, getSuggestedUsers, updateUser }