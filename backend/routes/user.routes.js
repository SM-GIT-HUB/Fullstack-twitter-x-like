import express from "express"
import protectRoute from "../middlewares/protectRoute.js"
import { followOrUnfollowUser, getSuggestedUsers, getUserProfile, searchUsers, updateUser } from "../controllers/user.controllers.js"

const router = express.Router();

router.get('/profile/:username', protectRoute, getUserProfile);
router.get('/suggested', protectRoute, getSuggestedUsers);
router.post('/follow/:id', protectRoute, followOrUnfollowUser);
router.post('/update', protectRoute, updateUser);
router.get('/search', protectRoute, searchUsers);


export default router