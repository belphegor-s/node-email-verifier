import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 8080;

import express from "express";
import getMXRecords from "./util/getMXRecords";
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
// console.log(getMXRecords('gmail.com'))
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

app.get('/', (req, res) => {
    res.send('Server is live 🍵')
});
app.use('/api/v1', verifyRoutes);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../views/404.html"));
})

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});
