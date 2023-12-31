import "dotenv/config";
const PORT = process.env?.PORT ?? 8080;

import express from "express";
// import getMXRecords from "./util/getMXRecords";
import verifyRoutes from "./routes/verify";
import fs from "fs";
import path from "path";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
const app = express();


const accessLogStream = fs.createWriteStream(
	path.join(__dirname,'../access.log'),
	{flags: 'a'}
)

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));
//////////////////////////////////////////////////////
///////////////////// One time////////////////////////
// (async () => {
//     console.log(await getMXRecords('ayushsharma.me'))
// })()
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

//////////////////////////////////////////////////////
///////////// Routes /////////////////////////////////
app.get('/', (req, res) => {
    res.send('Server is live 🍵')
});
app.use('/api/v1', verifyRoutes);
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});

export default app;
