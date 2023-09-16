import fs from "fs";
import { obj } from "../types/global";
import { customersCollectionPath, apiKeysCollectionPath } from "./dbPaths";

const customers: obj = JSON.parse(fs.readFileSync(customersCollectionPath, 'utf-8')), 
    apiKeys: obj = JSON.parse(fs.readFileSync(apiKeysCollectionPath, 'utf-8'));

export { customers, apiKeys }