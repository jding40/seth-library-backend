import { BorrowRecord } from '../models/BorrowRecord.js';
import Book from "../models/Book.js";
class BorrowRecordController {
    // 获取所有借阅记录
    static async getAll(req, res) {
        try {
            const records = await BorrowRecord.find();
            res.json(records);
        }
        catch (err) {
            res.status(500).json({ message: "Failed to fetch borrow records" });
        }
    }
    // 获取单个借阅记录
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
    // 创建借阅记录
    static async create(req, res) {
        try {
            const { ISBN, qty, borrowerName, borrowDate, notes } = req.body;
            // 查找对应的书本
            const book = await Book.findOne({ ISBN });
            if (!book)
                return res.status(404).json({ message: "Book not found" });
            const availableQty = book.qtyOwned - book.borrowedBooksCount;
            if (availableQty < qty) {
                // console.log("book.qtyOwned: "+book.qtyOwned);
                // console.log("qty: "+ qty);
                return res.status(400).json({ message: `Only ${availableQty} left in stock` });
            }
            // 调整借出数量
            book.borrowedBooksCount += qty;
            await book.save();
            // 保存借阅记录
            const record = new BorrowRecord({ ISBN, qty, borrowerName, borrowDate, notes });
            await record.save();
            res.status(201).json(record);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    // 更新借阅记录
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
            //正常return
            await book.save();
            //update BorrowRecord
            await BorrowRecord.findByIdAndUpdate(req.params.id, req.body);
            res.json({ message: "Record updated" });
        }
        catch (err) {
            res.status(400).json({ message: "Failed to update record" });
        }
    }
    // 删除借阅记录 & 恢复库存
    static async delete(req, res) {
        try {
            const record = await BorrowRecord.findById(req.params.id);
            if (!record)
                return res.status(404).json({ message: "Record not found" });
            // 恢复库存
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