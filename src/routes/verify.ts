import { Router } from "express";
import { getMXRecordsController, verifyBulkEmailsController, verifyEmailController } from "../controllers/verify";
const router = Router();

router.get('/verify/:email', verifyEmailController);
router.post('/verify-bulk', verifyBulkEmailsController);
router.get('/get-mx-records/:domain', getMXRecordsController)

export default router;