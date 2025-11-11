import { Schema, model, Document, Model } from "mongoose";

export interface IParseBomRecord extends Document {

    email:string;
    uuid:string;
    originalString:string;
    timestamp:Date;

}

const parseBomSchema = new Schema<IParseBomRecord>(
    {
        email: { type: String, required: true },
        uuid: { type: String, required: true },
        originalString: { type: String, required: true },
        timestamp: { type: Date, required: true},

    }

)

const ParseBomRecord:Model<IParseBomRecord> = model<IParseBomRecord>("parseBomRecords", parseBomSchema);
export {ParseBomRecord};