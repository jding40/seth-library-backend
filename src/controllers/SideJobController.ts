import type { Request, Response } from "express";
import {ParseBomRecord, type IParseBomRecord} from "../models/ParseBomRecord.js";

class SideJobController {

    static async saveBomParseRecord(req: Request, res: Response) {
        const bomParseRecord:IParseBomRecord = req.body;
        const record = new ParseBomRecord(bomParseRecord);
        await record.save();
    }
}

export default SideJobController;