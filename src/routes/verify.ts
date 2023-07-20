import { Router } from "express";
import { getMXRecordsController, verifyEmail } from "../controllers/verify";
const router = Router();

router.get('/verify/:email', verifyEmail);
router.get('/getMXRecords/:domain', getMXRecordsController)

export default router;