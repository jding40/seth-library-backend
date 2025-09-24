import { BorrowRecord } from '../models/BorrowRecord.js';
import Book from "../models/Book.js";
class BorrowRecordController {
    // get all borrow records
    static async getAll(req, res) {
        try {
            const records = await BorrowRecord.find();
            res.json(records);
        }
        catch (err) {
            res.status(500).json({ message: "Failed to fetch borrow records" });
        }
    }
    // get one borrow record
    static async getById(req, res) {
        try {
            const record = await BorrowRecord.findById(req.params.id);
            if (!record)
                return res.status(404).json({ message: "Record not found" });
            res.json(record);
        }
        catch (err) {
            res.status(500).json({ message: "Failed to fetch record" });
        }
    }
    // create a new borrow record
    static async create(req, res) {
        console.log("create borrow record");
        try {
            const { ISBN, totalQty, borrowerName, borrowDate, notes } = req.body;
            const outstandingQty = totalQty;
            // query related book
            const book = await Book.findOne({ ISBN });
            if (!book)
                return res.status(404).json({ message: "Book not found" });
            console.log("book.borrowedBooksCount: " + book.borrowedBooksCount);
            const availableQty = book.qtyOwned - book.borrowedBooksCount;
            if (availableQty < totalQty) {
                // console.log("book.qtyOwned: "+book.qtyOwned);
                // console.log("qty: "+ qty);
                return res.status(400).json({ message: `Only ${availableQty} left in stock` });
            }
            // adjust borrowed books count
            book.borrowedBooksCount += totalQty;
            await book.save();
            // save borrow record
            const record = new BorrowRecord({ ISBN, totalQty, outstandingQty, borrowerName, borrowDate, notes });
            await record.save();
            res.status(201).json(record);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    //toggleBadDebt
    static async toggleBadDebt(req, res) {
        try {
            const record = await BorrowRecord.findById(req.params.id);
            if (!record)
                return res.status(404).json({ message: "Record not found" });
            if (record.isReturned)
                return res.status(404).json({ message: "You can't toggle bad debt on a returned record" });
            const { ISBN, outstandingQty, isBadDebt } = record;
            if (isBadDebt) {
                await Book.findOneAndUpdate({ ISBN: ISBN }, {
                    $inc: {
                        qtyOwned: outstandingQty,
                        borrowedBooksCount: outstandingQty
                    }
                });
            }
            else {
                await Book.findOneAndUpdate({ ISBN: ISBN }, {
                    $inc: {
                        qtyOwned: -outstandingQty,
                        borrowedBooksCount: -outstandingQty
                    }
                });
            }
            record.isBadDebt = !record.isBadDebt;
            await BorrowRecord.findByIdAndUpdate(req.params.id, { isBadDebt: !isBadDebt });
        }
        catch (err) {
            console.log(err);
        }
    }
    //toggleReturned
    static async toggleReturned(req, res) {
        try {
            const record = await BorrowRecord.findById(req.params.id);
            if (!record)
                return res.status(404).json({ message: "Record not found" });
            const { ISBN, outstandingQty, isReturned, isBadDebt } = record;
            if (isBadDebt)
                return res.status(400).json({ message: "Bad debt record cannot be returned" });
            if (isReturned) {
                await Book.findOneAndUpdate({ ISBN: ISBN }, {
                    $inc: {
                        borrowedBooksCount: outstandingQty
                    }
                });
            }
            else {
                await Book.findOneAndUpdate({ ISBN: ISBN }, {
                    $inc: {
                        borrowedBooksCount: -outstandingQty
                    }
                });
            }
            record.isBadDebt = !record.isBadDebt;
            console.log("isReturned: " + isReturned);
            await BorrowRecord.findByIdAndUpdate(req.params.id, { isReturned: !isReturned, returnDate: new Date(), outstandingQty: 0 });
        }
        catch (err) {
            console.log(err);
        }
    }
    // update borrow record
    static async update(req, res) {
        try {
            const originalRecord = await BorrowRecord.findById(req.params.id);
            console.log("borrow controller=> originalRecord:" + originalRecord);
            if (!originalRecord)
                return res.status(404).json({ message: "Record not found" });
            const { ISBN, outstandingQty, isReturned, borrowerName, borrowDate, returnDate, isBadDebt, notes } = req.body;
            const book = await Book.findOne({ ISBN: originalRecord.ISBN });
            if (!book)
                return res.status(404).json({ message: "Book not found..." });
            //adjust book object
            //bad debt
            if ((originalRecord.isBadDebt === true && isBadDebt === false) || (originalRecord.isBadDebt === false && isBadDebt === true)) {
                return res.status(400).json({ message: "Cannot toggle bad debt status here..." });
            }
            if ((originalRecord.isReturned === true && isReturned === false) || (originalRecord.isReturned === false && isReturned === true)) {
                return res.status(400).json({ message: "Cannot toggle return status here..." });
            }
            if (originalRecord.ISBN !== ISBN) {
                return res.status(400).json({ message: "Cannot change ISBN here..." });
            }
            book.borrowedBooksCount -= (originalRecord.outstandingQty - outstandingQty);
            //update book
            await Book.findOneAndUpdate({ ISBN: originalRecord.ISBN }, { borrowedBooksCount: book.borrowedBooksCount });
            //update BorrowRecord
            console.log("print after book.save() ");
            //update BorrowRecord
            await BorrowRecord.findByIdAndUpdate(req.params.id, req.body);
            res.json({ message: "Record updated" });
        }
        catch (err) {
            res.status(400).json({ message: "Failed to update record" });
        }
    }
    // delete borrow record
    static async delete(req, res) {
        try {
            const record = await BorrowRecord.findById(req.params.id);
            if (!record)
                return res.status(404).json({ message: "Record not found" });
            // Restore stock quantity
            // const book:IBook | null = await Book.findOne({ ISBN: record.ISBN });
            // if (!book) return res.status(404).json({ message: "Book not found" });
            if (!record.isReturned && !record.isBadDebt) {
                return res.status(400).json({ message: "Cannot delete a unreturned record" });
            }
            await BorrowRecord.deleteOne({ _id: req.params.id });
            res.json({ message: "Record deleted..." });
        }
        catch (err) {
            res.status(500).json({ message: "Failed to delete record" });
        }
    }
}
export default BorrowRecordController;
//# sourceMappingURL=BorrowRecordController.js.map