import path from "path";

const customersCollectionPath = path.join(process.cwd(), 'database/customers.json'),
    apiKeysCollectionPath = path.join(process.cwd(), 'database/apiKeys.json');

export { customersCollectionPath, apiKeysCollectionPath }