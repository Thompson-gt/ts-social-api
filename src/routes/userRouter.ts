import { Router } from "express";
import {
    getUser,
    deleteUser,
    updateUser,
    handleUserFollows,
} from "../controllers/userControllers";

const router = Router();
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/handleFollow", handleUserFollows);

export const userRouter = router;
