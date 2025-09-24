import { BorrowRecord,type IBorrowRecord} from '../models/BorrowRecord.js';
import Book from "../models/Book.js";
import type { IBook } from "../models/Book.js";
import type { Request, Response } from 'express';


class BorrowRecordController {
    // get all borrow records
    static async getAll(req: Request, res: Response) {
        try {
            const records = await BorrowRecord.find();
            return res.json(records);
        } catch (err) {
            return res.status(500).json({ message: "Internal server error in BorrowRecordController.getAll" });
        }
    }

    // get one borrow record
    static async getById(req: Request, res: Response) {
        try {
            const record = await BorrowRecord.findById(req.params.id);
            if (!record) return res.status(404).json({ message: "Record not found" });
            return res.json(record);
        } catch (err) {
            return res.status(500).json({ message: "Internal server error in BorrowRecordController.getById" });
        }
    }

    // create a new borrow record
    static async create(req: Request, res: Response) {
        console.log("create borrow record");
        try {
            const { ISBN, totalQty,  borrowerName, borrowDate, notes } = req.body;
            const outstandingQty:number = totalQty;

            // query related book
            const book = await Book.findOne({ ISBN });
            if (!book) return res.status(404).json({ message: "Book not found" });

            // console.log("book.borrowedBooksCount: "+book.borrowedBooksCount);

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
            const record = new BorrowRecord({ ISBN, totalQty,outstandingQty, borrowerName, borrowDate, notes });
            await record.save();

            return res.status(201).json(record);
        } catch (err) {
            return res.status(400).json({ message: "Internal server error in BorrowRecordController.create" });
        }
    }

    //toggleBadDebt
    static async toggleBadDebt(req: Request, res: Response) {
        try {
            const record = await BorrowRecord.findById(req.params.id);
            if (!record) return res.status(404).json({ message: "Record not found" });
            if (record.isReturned) return res.status(404).json({ message: "You can't toggle bad debt on a returned record" });
            const {ISBN, outstandingQty, isBadDebt}= record;
            if (isBadDebt){
                await Book.findOneAndUpdate(
                    { ISBN: ISBN },
                    {
                        $inc: {
                            qtyOwned: outstandingQty,
                            borrowedBooksCount: outstandingQty
                        }
                    },
                );
            }else {
                await Book.findOneAndUpdate(
                    { ISBN: ISBN },
                    {
                        $inc: {
                            qtyOwned: -outstandingQty,
                            borrowedBooksCount: -outstandingQty
                        }
                    },
                )
            }
            record.isBadDebt=!record.isBadDebt;
            await BorrowRecord.findByIdAndUpdate(req.params.id,  { isBadDebt: !isBadDebt });
        }catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal server error in BorrowRecordController.toggleBadDebt" });
        }
    }

    //toggleReturned
    static async handleReturn(req: Request, res: Response) {
        try {
            const record = await BorrowRecord.findById(req.params.id);
            if (!record) return res.status(404).json({ message: "Record not found" });
            const {ISBN, outstandingQty, isReturned, isBadDebt}= record;
            if(isBadDebt) return res.status(400).json({ message: "Bad debt record cannot be returned" });
            if (isReturned){
               return res.status(400).json({ message: "You can't toggle return on a returned record" });
            }else {
                await Book.findOneAndUpdate(
                    { ISBN: ISBN },
                    {
                        $inc: {
                            borrowedBooksCount: -outstandingQty
                        }
                    },
                )
            }
            record.isBadDebt=!record.isBadDebt;

            await BorrowRecord.findByIdAndUpdate(req.params.id, { isReturned: !isReturned, returnDate: new Date(),outstandingQty: 0});

            return res.json({ message: "Book returned successfully" });
        }catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal server error in BorrowRecordController.handleReturn" });
        }
    }

    // update borrow record
    static async update(req: Request, res: Response) {
        try {
            const originalRecord:IBorrowRecord |null = await BorrowRecord.findById(req.params.id);
            console.log("borrow controller=> originalRecord:"+originalRecord);
            if(!originalRecord) return res.status(404).json({ message: "Record not found" });

            const { ISBN, outstandingQty, isReturned, borrowerName, borrowDate, returnDate, isBadDebt, notes } = req.body;
            const book:IBook | null = await Book.findOne({ ISBN: originalRecord.ISBN });
            if (!book) return res.status(404).json({ message: "Book not found..." });

            //adjust book object
            //bad debt
            if((originalRecord.isBadDebt === true && isBadDebt === false) || (originalRecord.isBadDebt === false && isBadDebt === true) ){
                return res.status(400).json({ message: "Cannot toggle bad debt status here..." });
            }

            if((originalRecord.isReturned === true && isReturned === false) || (originalRecord.isReturned === false && isReturned === true) ){
                return res.status(400).json({ message: "Cannot toggle return status here..." });
            }

            if(originalRecord.ISBN !== ISBN){
                return res.status(400).json({ message: "Cannot change ISBN here..." });
            }

            book.borrowedBooksCount -= (originalRecord.outstandingQty - outstandingQty);

            //update book
            await Book.findOneAndUpdate({ISBN: originalRecord.ISBN}, {borrowedBooksCount: book.borrowedBooksCount});
            //update BorrowRecord
            console.log("print after book.save() ")

            //update BorrowRecord
            await BorrowRecord.findByIdAndUpdate(req.params.id, req.body);

            res.json({message: "Record updated"});

        } catch (err) {
            res.status(400).json({ message: "Failed to update record" });
        }
    }

    // delete borrow record
    static async delete(req: Request, res: Response) {
        try {
            const record = await BorrowRecord.findById(req.params.id);
            if (!record) return res.status(404).json({ message: "Record not found" });

            // Restore stock quantity

            // const book:IBook | null = await Book.findOne({ ISBN: record.ISBN });
            // if (!book) return res.status(404).json({ message: "Book not found" });


            if(!record.isReturned && !record.isBadDebt) {
                return res.status(400).json({ message: "Cannot delete a unreturned record" });
            }

            await BorrowRecord.deleteOne({_id: req.params.id});
            res.json({ message: "Record deleted..." });
        } catch (err) {
            res.status(500).json({ message: "Failed to delete record" });
        }
    }
}

export default BorrowRecordController;
