import { Router } from "express";
import { verifyEmail } from "../controllers/verify";
const router = Router();

router.get('/verify/:email', verifyEmail);

export default router;