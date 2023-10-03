import { Request, Response } from "express";
import emailSyntaxCheck from "../util/emailSyntaxCheck";
import validObj from "../util/validObj";
import getMXRecords from "../util/getMXRecords";
import { MxRecord } from "dns";
import domainCheck from "../util/domainCheck";
import verifyEmail from "../services/verifyEmail";
import { obj } from "../types/global";

const verifyEmailController = async (req: Request, res: Response) => {
    let success = false, msg = '', data: any = {}, status = 200;
    try {
        const email = (req.params?.email && typeof req.params?.email === 'string' && req.params?.email?.trim()) || '';

        if(!email || !emailSyntaxCheck(email)) {
            msg = 'Invalid email syntax!';
            status = 422;
            throw new Error(msg);
        }

        success = true;
        msg = "Successfully fetched email verification status";
        data = await verifyEmail(email);
    } catch(e) {
        msg = msg || 'Internal server error';
        status = status || 500;
        console.error(`Error occured in verifyEmailController() -> `, e);
    } finally {
        res.status(status).json({
            success,
            msg,
            ...validObj(data) ? { data } : {}
        })
    }
}

const verifyBulkEmailsController = async (req: Request, res: Response) => {
    let success = false, msg = '', data: any = {}, status = 200;
    try {
        const emails = (req.body?.emails && Array.isArray(req.body?.emails) && req.body?.emails?.length > 0 && req.body?.emails) ?? [];
        
        if(!emails || !(emails?.length > 0)) {
            msg = 'Invalid emails input!';
            status = 422;
            throw new Error(msg);
        }

        const result: obj = {};

        for (const email of emails) {
            emailSyntaxCheck(email) ? result[email] = await verifyEmail(email) : result[email] = 'Email syntax is invalid';
        }

        if(validObj(result)) {
            success = true;
            msg = "Successfully fetched bulk emails verification data";
            data = { ...result };
        }
    } catch(e) {
        msg = msg || 'Internal server error';
        status = status || 500;
        console.error(`Error occured in verifyBulkEmailsController() -> `, e);
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
        if(mxRecords === -1) {
            msg = `Error getting MX records for domain -> ${domain}`;
            status = 500;
            throw new Error(msg)
        }
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

export { verifyEmailController, verifyBulkEmailsController, getMXRecordsController }