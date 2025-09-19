// import express, { type Request, type Response } from "express";
//
// import cors from "cors";

//const app = express();

import app from "./app.js";
import dotenv from "dotenv";
import fs from "fs";
import https from "https";

dotenv.config();

const port = process.env.PORT;

// http -> https
const options = {
  key: fs.readFileSync("./localhost-key.pem"),  // 或 server.key
  cert: fs.readFileSync("./localhost.pem"),    // 或 server.cert
};

https.createServer(options, app).listen(port, () => {
  console.log("HTTPS server running at https://localhost:5000");
});

// app.listen(port, () => {
//   console.log("process.env.PORT is: " + port);
//   console.log(`API server running at http://localhost:${port}`);
// });
