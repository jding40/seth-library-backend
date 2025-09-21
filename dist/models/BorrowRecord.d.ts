import { Document, Model } from "mongoose";
export interface IBorrowRecord extends Document {
    ISBN: string;
    totalQty: number;
    outstandingQty: number;
    borrowerName: string;
    borrowDate: Date;
    isReturned?: boolean;
    returnDate?: Date;
    isBadDebt?: boolean;
    notes?: string;
}
declare const BorrowRecord: Model<IBorrowRecord>;
export { BorrowRecord };
//# sourceMappingURL=BorrowRecord.d.ts.map