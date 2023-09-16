import { config } from "dotenv";
config();

const STRIPE_SECRET_KEY = process.env?.STRIPE_SECRET_KEY || '',
    STRIPE_PRICE_ID = process.env?.STRIPE_PRICE_ID || '',
    WEBHOOK_SECRET = process.env?.WEBHOOK_SECRET || '';

if(!STRIPE_SECRET_KEY) {
    throw new Error(`STRIPE_SECRET_KEY missing!`);
} else if(!STRIPE_PRICE_ID) {
    throw new Error(`STRIPE_PRICE_ID missing!`);
} else if(!WEBHOOK_SECRET) {
    throw new Error(`WEBHOOK_SECRET missing!`);
}

export { STRIPE_SECRET_KEY, STRIPE_PRICE_ID, WEBHOOK_SECRET }