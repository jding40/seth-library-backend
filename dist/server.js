// import express, { type Request, type Response } from "express";
//
// import cors from "cors";
//const app = express();
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT;
app.listen(port, () => {
    console.log("process.env.PORT is: " + port);
    console.log(`API server running at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map