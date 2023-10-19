import { Router } from "express";
import {
    getPost,
    updatePost,
    deletePost,
    handlePostsLikes,
    createPost,
} from "../controllers/postControllers";

const router = Router();

router.get("/:id", getPost);
router.put("/:id", updatePost);
router.post("/", createPost);
router.delete("/:id", deletePost);
router.put("/:id/handleFollow", handlePostsLikes);
export const postRouter = router;
