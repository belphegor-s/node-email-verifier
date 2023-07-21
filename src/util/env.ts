const PORT = process.env?.PORT || 8080; // port is optional (no check)
    // STRIPE_SECRET = process.env?.STRIPE_SECRET || '',
    // PRICE_KEY = process.env?.PRICE_KEY || '';

// if(!STRIPE_SECRET) {
//     throw new Error('STRIPE_SECRET missing!');
// } else if(!PRICE_KEY) {
//     throw new Error(`PRICE_KEY missing!`);
// }

export { PORT };