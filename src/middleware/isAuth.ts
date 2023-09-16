import { Request, Response, NextFunction } from "express";
import hashAPIKey from "../util/hashAPIKey";
import stripe from "../stripe";
import { apiKeys, customers } from "../util/dbAccess";

export const apiAuth = async (req: Request, res: Response, next: NextFunction) => {
    let success = false, msg = '';
    const apiKey = req.get('X-API-Key');
    
    if(!apiKey) {
        msg = 'API key not provided!';
        return res.status(401).json({ success, msg });
    }

    const hashedAPIKey = hashAPIKey(apiKey),
        customerID = apiKeys[hashedAPIKey],
        customer = customers[customerID];

    if(!customer || !customer.active) {
        msg = 'Not authorized!';
        return res.status(403).json({ success, msg });
    } else {
        // charging the user
        await stripe.subscriptionItems.createUsageRecord(customer.itemId,
            {
                quantity: 1,
                timestamp: 'now',
                action: 'increment',
            }
        );
    }
    next();
}