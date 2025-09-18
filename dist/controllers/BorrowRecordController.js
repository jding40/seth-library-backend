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
        try {
            const { ISBN, qty, borrowerName, borrowDate, notes } = req.body;
            // query related book
            const book = await Book.findOne({ ISBN });
            if (!book)
                return res.status(404).json({ message: "Book not found" });
            const availableQty = book.qtyOwned - book.borrowedBooksCount;
            if (availableQty < qty) {
                // console.log("book.qtyOwned: "+book.qtyOwned);
                // console.log("qty: "+ qty);
                return res.status(400).json({ message: `Only ${availableQty} left in stock` });
            }
            // adjust borrowed books count
            book.borrowedBooksCount += qty;
            await book.save();
            // save borrow record
            const record = new BorrowRecord({ ISBN, qty, borrowerName, borrowDate, notes });
            await record.save();
            res.status(201).json(record);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    // update borrow record
    static async update(req, res) {
        try {
            const originalRecord = await BorrowRecord.findById(req.params.id);
            if (!originalRecord)
                return res.status(404).json({ message: "Record not found" });
            const { ISBN, qty, borrowerName, borrowDate, returnDate, isBadDebt, notes } = req.body;
            const book = await Book.findOne({ ISBN: originalRecord.ISBN });
            if (!book)
                return res.status(404).json({ message: "Book not found" });
            console.log("book:" + book);
            //adjust book object
            //bad debt
            if (!originalRecord.isBadDebt && isBadDebt) {
                book.qtyOwned -= qty;
                book.borrowedBooksCount -= originalRecord.qty;
            }
            //bad debt return
            else if (originalRecord.isBadDebt && !isBadDebt) {
                book.qtyOwned += qty;
            }
            else { // book returned
                console.log("originalRecord.qty - qty: " + (originalRecord.qty - qty));
                // book.qtyOwned += (originalRecord.qty - qty);
                book.borrowedBooksCount -= (originalRecord.qty - qty);
            }
            //normal return
            await book.save();
            //update BorrowRecord
            await BorrowRecord.findByIdAndUpdate(req.params.id, req.body);
            res.json({ message: "Record updated" });
        }
        catch (err) {
            res.status(400).json({ message: "Failed to update record" });
        }
    }
    // delete borrow record & Restore stock quantity
    static async delete(req, res) {
        try {
            const record = await BorrowRecord.findById(req.params.id);
            if (!record)
                return res.status(404).json({ message: "Record not found" });
            // Restore stock quantity
            const book = await Book.findOne({ ISBN: record.ISBN });
            if (!book)
                return res.status(404).json({ message: "Book not found" });
            if (!record.isReturned && !record.isBadDebt) {
                book.qtyOwned -= record.qty;
                book.borrowedBooksCount -= record.qty;
                await book.save();
            }
            await record.deleteOne();
            res.json({ message: "Record deleted..." });
        }
        catch (err) {
            res.status(500).json({ message: "Failed to delete record" });
        }
    }
}
export default BorrowRecordController;
//# sourceMappingURL=BorrowRecordController.js.map