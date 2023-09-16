import { Router } from "express";
import { getMXRecordsController, verifyEmail } from "../controllers/verify";
import { apiAuth } from "../middleware/isAuth";
const router = Router();

router.get('/verify/:email',  apiAuth, verifyEmail);
router.get('/getMXRecords/:domain', apiAuth, getMXRecordsController)

export default router;