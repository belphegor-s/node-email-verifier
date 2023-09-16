import { config } from "dotenv";
config();
const PORT = process.env?.PORT ?? 8080;

import express, { Request, Response } from "express";
// import getMXRecords from "./util/getMXRecords";
import verifyRoutes from "./routes/verify";
import billingRoutes from "./routes/billing";
import fs from "fs";
import path from "path";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
const app = express();

declare global {
    namespace Express {
        interface Request {
            rawBody?: Buffer | string;
        }
    }
}

const accessLogStream = fs.createWriteStream(
	path.join(__dirname,'../access.log'),
	{flags: 'a'}
)

app.use(express.json({
    verify: (req: Request, res: Response, buffer: Buffer) => (req['rawBody'] = buffer),
}));
app.use(express.static(path.join(__dirname, '../public')));
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));
//////////////////////////////////////////////////////
///////////////////// One time////////////////////////
// console.log(getMXRecords('gmail.com'))
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

//////////////////////////////////////////////////////
///////////// Routes /////////////////////////////////
app.get('/', (req, res) => {
    res.send('Server is live 🍵')
});
app.use('/api/v1', verifyRoutes);
app.use('/api/v1', billingRoutes);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../views/404.html"));
})
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});

export default app;
