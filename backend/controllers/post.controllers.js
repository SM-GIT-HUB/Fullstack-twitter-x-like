import notificationModel from "../models/notification.model.js"
import postModel from "../models/post.model.js"
import userModel from "../models/user.model.js"
import { v2 as cloudinary } from "cloudinary"

async function createPost(req, res)
{
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!text && !img) {
            return res.status(400).json({ error: "Post must have any text or image" });
        }

        if (img)
        {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = await postModel.create({
            user: userId,
            text,
            img
        })

        res.status(201).json( newPost );
    }
    catch(err) {
        console.log(`error in createpost ${err.message}`);
        res.status(500).json({ error: "Something went wrong" });
    }
}


async function deletePost(req, res)
{
    try {
        const { id } = req.params;
        const post = await postModel.findById(id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.user.toString() != req.user._id.toString()) {
            console.log(post.user);
            console.log(req.user._id);
            return res.status(403).json({ error: "You don't have permission to delete this post" });
        }

        if (post.img)
        {
            const imageId = post.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imageId);
        }

        await postModel.findByIdAndDelete(post._id);

        res.status(200).json({ message: "Post deleted successfully" });
    }
    catch(err) {
        console.log(`error in deletePost ${err.message}`);
        res.status(500).json({ error: "Something went wrong" });
    }
}


async function commentPost(req, res)
{
    try {
        const { id } = req.params;

        const post = await postModel.findById(id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        
        const { text } = req.body;
        const userId = req.user._id.toString();

        if (!text) {
            return res.status(400).json({ error: "Comment cannot be empty" });
        }

        const newComment = { user: userId, text };
        post.comments.push(newComment);

        await post.save();

        await notificationModel.create({
            from: userId,
            to: post.user,
            type: 'comment'
        })

        res.status(201).json( newComment );
    }
    catch(err) {
        console.log(`error in commentPost ${err.message}`);
        res.status(500).json({ error: "Something went wrong" });
    }
}


async function likeOrUnlikePost(req, res)
{
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const post = await postModel.findById(id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const likedByUser = post.likes.includes(userId);

        if (likedByUser)
        {
            await post.updateOne({ $pull: { likes: userId } });
            await userModel.updateOne({ _id: userId }, { $pull: { likedPosts: id } });

            res.status(200).json({ message: "Unliked the post" });
        }
        else
        {
            await userModel.updateOne({ _id: userId }, { $push: { likedPosts: id } });

            post.likes.push(userId);
            await post.save();

            await notificationModel.create({
                from: userId,
                to: post.user,
                type: 'like'
            })

            res.status(201).json({ message: "Post liked" });
        }
    }
    catch(err) {
        console.log(`error in likeOrUnlikePost ${err.message}`);
        res.status(500).json({ error: "Something went wrong" });
    }
}


async function getAllPosts(req, res)
{
    try {
        const posts = await postModel.aggregate([
            { $sample: { size: 100 } },
            { $sort: { createdAt: -1 } }
        ])

        await postModel.populate(posts, [
            { path: 'user', select: "-password" },
            { path: 'comments.user', select: "-password" }
        ])

        res.status(200).json( posts );
    }
    catch(err) {
        console.log(`error in getAllPosts ${err.message}`);
        res.status(500).json({ error: "Something went wrong" });
    }
}


async function getLikedPosts(req, res)
{
    try {
        const userId = req.params.id;

        const user = await userModel.findById(userId).select('likedPosts').populate('likedPosts');

        await userModel.populate(user.likedPosts, [
            { path: 'user', select: "-password" },
            { path: 'comments.user', select: "-password" }
        ])

        // const user = await userModel.findById(userId).select('likedPosts').populate('likedPosts');

        // await userModel.populate(user, [
        //     {
        //         path: 'likedPosts', populate: [
        //             { path: 'user', select: '-password' },
        //             { path: 'comments.user', select: '-password' }
        //         ]
        //     }
        // ])

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    }
    catch(err) {
        console.log(`error in getLikedPosts ${err.message}`);
        res.status(500).json({ error: "Something went wrong" });
    }
}


async function getFollowingPosts(req, res)
{
    try {
        const userId = req.user._id;

        const user = await userModel.findById(userId).select("following");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const following = user.following;

        const feedPosts = await postModel.aggregate([
            { $match: { user: { $in: following } } },
            { $sample: { size: 100 } },
            { $sort: { createdAt: -1 } }
        ])

        await postModel.populate(feedPosts, [
            { path: 'user', select: "-password" },
            { path: 'comments.user', select: "-password" }
        ])

        res.status(200).json( feedPosts );
    }
    catch(err) {
        console.log(`error in getFollowingPosts ${err.message}`);
        res.status(500).json({ error: "Something went wrong" });
    }
}


async function getUserPosts(req, res)
{
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const posts = await postModel.aggregate([
            { $match: { user: user._id } },
            { $sample: { size: 100 } },
            { $sort: { createdAt: -1 } }
        ])

        await postModel.populate(posts, [
            { path: 'user', select: "-password" },
            { path: 'comments.user', select: "-password" }
        ])

        res.status(200).json( posts );
    }
    catch(err) {
        console.log(`error in getUserPosts ${err.message}`);
        res.status(500).json({ error: "Something went wrong" });
    }
}


export { createPost, deletePost, commentPost, likeOrUnlikePost, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts }