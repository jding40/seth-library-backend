import { Schema, model, Document, Model } from "mongoose";
const borrowRecordSchema = new Schema({
    ISBN: { type: String, required: true },
    qty: { type: Number, required: true, min: 0 },
    borrowerName: { type: String, required: true },
    borrowDate: { type: Date, required: true },
    returnDate: { type: Date },
    isReturned: { type: Boolean, default: false },
    isBadDebt: { type: Boolean, default: false },
    notes: { type: String },
});
const BorrowRecord = model("borrowRecords", borrowRecordSchema);
export { BorrowRecord };
//# sourceMappingURL=BorrowRecord.js.map