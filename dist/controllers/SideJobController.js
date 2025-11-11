import { ParseBomRecord } from "../models/ParseBomRecord.js";
class SideJobController {
    static async saveBomParseRecord(req, res) {
        const bomParseRecord = req.body;
        const record = new ParseBomRecord(bomParseRecord);
        await record.save();
    }
}
export default SideJobController;
//# sourceMappingURL=SideJobController.js.map