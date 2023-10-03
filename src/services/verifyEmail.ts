import { MxRecord } from "dns";
import getMXRecords from "../util/getMXRecords";
import { TTestInboxResult } from "../types/global";
import testInboxOnServer from "../util/testInboxOnServer";
import { randomBytes } from "crypto";
import emailSyntaxCheck from "../util/emailSyntaxCheck";

const verifyEmail = async (email: string) => {
    const domain = email.split('@')[1];
    const mxRecords = await getMXRecords(domain);

    if(mxRecords === -1) {
        return `Error getting MX records for domain -> ${domain}`;
    }

    const sortedMXRecords = mxRecords?.sort((a: MxRecord, b: MxRecord) => a.priority - b.priority);

    let smtpResult: TTestInboxResult = {connection_succeeded: false, inbox_exists: false};
    let hostIndex = 0;

    while(hostIndex < sortedMXRecords?.length) {
        try {
            smtpResult = await testInboxOnServer(sortedMXRecords[hostIndex].exchange, email);

            if(!smtpResult.connection_succeeded) {
                hostIndex++;
            } else {
                break;
            }
        } catch(e) {
            console.error(e);
        }
    }

    let usesCatchAll = false;
    try {
        const testCatchAll = await testInboxOnServer(sortedMXRecords[hostIndex].exchange, `${randomBytes(20).toString('hex')}@${domain}`)
        usesCatchAll = testCatchAll.inbox_exists;
    } catch(e) {
        console.error(e)
    }

    return {
        email,
        email_format_valid: emailSyntaxCheck(email),
        uses_catch_all: usesCatchAll,
        ...smtpResult,
        mx_records: sortedMXRecords
    }
}

export default verifyEmail