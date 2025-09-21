import { Schema, model, Document, Model } from "mongoose";

export interface IBorrowRecord extends Document {
    ISBN: string;
    totalQty:number;
    outstandingQty: number;
    borrowerName: string;
    borrowDate:Date;
    isReturned?: boolean;
    returnDate?:Date,
    isBadDebt?: boolean;
    notes?: string;
}

const borrowRecordSchema = new Schema<IBorrowRecord>(
    {
        ISBN: { type: String, required: true },
        totalQty: { type: Number, required: true, min: 0 },
        outstandingQty: { type: Number, required: true, min: 0 },
        borrowerName: { type: String, required: true },
        borrowDate: { type: Date, required: true},
        returnDate: { type: Date },
        isReturned: { type: Boolean ,default: false},
        isBadDebt: { type: Boolean, default: false },
        notes: { type: String},
    }

)

const BorrowRecord:Model<IBorrowRecord> = model<IBorrowRecord>("borrowRecords", borrowRecordSchema);
export {BorrowRecord};