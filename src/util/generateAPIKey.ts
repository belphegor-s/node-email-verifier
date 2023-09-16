import hashAPIKey from "./hashAPIKey";
import { randomBytes } from "crypto";
import { apiKeys } from "./dbAccess";

const generateAPIKey = () => {
    const apiKey = randomBytes(16).toString('hex');
    const hashedAPIKey = hashAPIKey(apiKey);

    // Ensure API key is unique
    if (apiKeys[hashedAPIKey]) {
        generateAPIKey();
    } else {
        return { hashedAPIKey, apiKey };
    }
}

export default generateAPIKey