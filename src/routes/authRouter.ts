import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authControllers";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export const authRouter = router;
