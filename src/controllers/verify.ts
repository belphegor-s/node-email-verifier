import { Request, Response } from "express";
import emailSyntaxCheck from "../util/emailSyntaxCheck";
import validObj from "../util/validObj";
import getMXRecords from "../util/getMXRecords";
import { MxRecord } from "dns";
import { TTestInboxResult } from "../types/global";
import testInboxOnServer from "../util/testInboxOnServer";
import { randomBytes } from "crypto";
import domainCheck from "../util/domainCheck";

const verifyEmail = async (req: Request, res: Response) => {
    let success = false, msg = '', data: any = {}, status = 200;
    try {
        const email = (req.params?.email && typeof req.params?.email === 'string' && req.params?.email?.trim()) || '';

        if(!email || !emailSyntaxCheck(email)) {
            msg = 'Invalid email syntax!';
            status = 422;
            throw new Error(msg);
        }

        const domain = email.split('@')[1];
        const mxRecords = await getMXRecords(domain);
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

        success = true;
        msg = "Successfully fetched email verification status";
        data = {
            email_format_valid: emailSyntaxCheck(email),
            uses_catch_all: usesCatchAll,
            ...smtpResult
        }
    } catch(e) {
        msg = msg || 'Internal server error';
        status = status || 500;
        console.error(`Error occured in verifyEmail() -> `, e);
    } finally {
        res.status(status).json({
            success,
            msg,
            ...validObj(data) ? { data } : {}
        })
    }
}

const getMXRecordsController = async (req: Request, res: Response) => {
    let success = false, msg = '', data: any = {}, status = 200;
    try {
        const domain = (req.params?.domain && typeof req.params?.domain === 'string' && req.params?.domain?.trim()) || '';

        if(!domain || !(await domainCheck(domain))) {
            msg = 'Invalid domain!';
            status = 422;
            throw new Error(msg);
        }

        const mxRecords = await getMXRecords(domain);
        const sortedMXRecords = mxRecords?.sort((a: MxRecord, b: MxRecord) => a.priority - b.priority);

        success = true;
        msg = `Successfully fetched MX records for the domain -> ${domain}`;
        data = {
            mxRecords: sortedMXRecords
        }
    } catch(e) {
        msg = msg || 'Internal server error';
        status = status || 500;
        console.error(`Error occured in getMXRecordsController() -> `, e);
    } finally {
        res.status(status).json({
            success,
            msg,
            ...validObj(data) ? { data } : {}
        })
    }
}

export { verifyEmail, getMXRecordsController }