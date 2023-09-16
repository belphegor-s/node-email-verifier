import { Router } from "express";
import { checkoutController, stripeWebhookController, usageController } from "../controllers/billing";
const router = Router();

router.post('/billing/checkout', checkoutController)
router.post('/billing/webhook', stripeWebhookController)
router.get('/billing/usage/:customer', usageController)

export default router;