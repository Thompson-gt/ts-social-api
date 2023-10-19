import { Router } from "express";
import {
    testPost,
    testQueryParams,
    testUser,
} from "../controllers/testControllers";

const router = Router();

router.get("/testuser", testUser);

router.get("/testpost", testPost);
router.get("/testquery", testQueryParams);

export const testRouter = router;
