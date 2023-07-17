import net from "net";
import { TTestInboxResult } from "../types/global";

enum SMTPStageNames {
    CHECK_CONNNECTION_ESTABLISHED = 'CHECK_CONNNECTION_ESTABLISHED',
    SEND_EHLO = 'SEND_EHLO',
    SEND_MAIL_FROM = 'SEND_MAIL_FROM',
    SEND_RECIPIENT_TO = 'SEND_RECIPIENT_TO'
}

const testInboxOnServer = async (smtpHostName: string, emailInbox: string): Promise<TTestInboxResult> => {
    return new Promise((resolve, reject) => {
        const result = {
            connection_succeeded: false,
            inbox_exists: false
        };

        const socket = net.createConnection(25, smtpHostName);
        let currentStageName = SMTPStageNames.CHECK_CONNNECTION_ESTABLISHED;

        socket.on('data', (data: Buffer) => {
            const response = data.toString('utf-8');
            console.log('<-- ', response);

            switch(currentStageName) {
                case SMTPStageNames.CHECK_CONNNECTION_ESTABLISHED: {
                    const expectedReplyCode = '220';
                    const nextStageName = SMTPStageNames.SEND_EHLO;
                    const command = `EHLO mail.example.org\r\n`;

                    if(!response.startsWith(expectedReplyCode)) {
                        console.error(response);
                        socket.end();
                        return resolve(result);
                    }

                    result.connection_succeeded = true;

                    socket.write(command, () => {
                        console.log('--> ', command);
                        currentStageName = nextStageName
                    })

                    break;
                }

                case SMTPStageNames.SEND_EHLO: {
                    const expectedReplyCode = '250';
                    const nextStageName = SMTPStageNames.SEND_MAIL_FROM;
                    const command = `MAIL FROM:<name@example.org>\r\n`;

                    if(!response.startsWith(expectedReplyCode)) {
                        socket.end();
                        return resolve(result);
                    }

                    socket.write(command, () => {
                        console.log('--> ', command);
                        currentStageName = nextStageName
                    })

                    break;
                }

                case SMTPStageNames.SEND_MAIL_FROM: {
                    const expectedReplyCode = '250';
                    const nextStageName = SMTPStageNames.SEND_RECIPIENT_TO;
                    const command = `RCPT TO:<${emailInbox}>\r\n`;

                    if(!response.startsWith(expectedReplyCode)) {
                        socket.end();
                        return resolve(result);
                    }

                    socket.write(command, () => {
                        console.log('--> ', command);
                        currentStageName = nextStageName
                    })

                    break;
                }

                case SMTPStageNames.SEND_RECIPIENT_TO: {
                    const expectedReplyCode = '250';
                    const command = `QUIT\r\n`;

                    if(!response.startsWith(expectedReplyCode)) {
                        socket.end();
                        return resolve(result);
                    }

                    result.inbox_exists = true;

                    socket.write(command, () => {
                        console.log('--> ', command);
                        socket.end();
                        return resolve(result);
                    })
                }
            }
        })

        socket.on('error', (err => {
            console.error(err);
            reject(err);
        }));

        socket.on('connect', () => {
            console.log(`Connected to: ${smtpHostName}`);
        })
    })
}

export default testInboxOnServer;