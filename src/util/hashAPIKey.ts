import { createHash } from "crypto";

const hashAPIKey = (apiKey: string) => {
    const hashedAPIKey = createHash('sha256').update(apiKey).digest('hex');
    return hashedAPIKey;
}

export default hashAPIKey;