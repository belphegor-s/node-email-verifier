import { MxRecord } from "dns";
import dnsPromises from "dns/promises";

const getMXRecords = async (domain: string) => {
    let records: MxRecord[] = [];
    try {
        records = await dnsPromises.resolveMx(domain) || [];
    } catch(e) {
        console.log(`Error occured in getMXRecords() -> `, e);
    } finally {
        return records;
    }
}

export default getMXRecords;