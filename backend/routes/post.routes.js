import express from "express"
import protectRoute from "../middlewares/protectRoute.js"
import { commentPost, createPost, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, getUserPosts, likeOrUnlikePost } from "../controllers/post.controllers.js"

const router = express.Router();

router.get('/all', protectRoute, getAllPosts);
router.get('/following', protectRoute, getFollowingPosts)
router.get('/likes/:id', protectRoute, getLikedPosts);
router.get('/user/:id', protectRoute, getUserPosts);
router.post('/create', protectRoute, createPost);
router.post('/like/:id', protectRoute, likeOrUnlikePost);
router.post('/comment/:id', protectRoute, commentPost);
router.delete('/:id', protectRoute, deletePost);


export default router