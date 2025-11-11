import { Schema, model, Document, Model } from "mongoose";
const parseBomSchema = new Schema({
    email: { type: String, required: true },
    uuid: { type: String, required: true },
    originalString: { type: String, required: true },
    timestamp: { type: Date, required: true },
});
const ParseBomRecord = model("parseBomRecords", parseBomSchema);
export { ParseBomRecord };
//# sourceMappingURL=ParseBomRecord.js.map