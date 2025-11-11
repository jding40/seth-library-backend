import { Document, Model } from "mongoose";
export interface IParseBomRecord extends Document {
    email: string;
    uuid: string;
    originalString: string;
    timestamp: Date;
}
declare const ParseBomRecord: Model<IParseBomRecord>;
export { ParseBomRecord };
//# sourceMappingURL=ParseBomRecord.d.ts.map