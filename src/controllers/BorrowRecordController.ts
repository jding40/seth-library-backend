import { BorrowRecord,type IBorrowRecord} from '../models/BorrowRecord.js';
import Book from "../models/Book.js";
import type { IBook } from "../models/Book.js";
import type { Request, Response } from 'express';


class BorrowRecordController {
    // get all borrow records
    static async getAll(req: Request, res: Response) {
        try {
            const records = await BorrowRecord.find();
            res.json(records);
        } catch (err) {
            res.status(500).json({ message: "Failed to fetch borrow records" });
        }
    }

    // get one borrow record
    static async getById(req: Request, res: Response) {
        try {
            const record = await BorrowRecord.findById(req.params.id);
            if (!record) return res.status(404).json({ message: "Record not found" });
            res.json(record);
        } catch (err) {
            res.status(500).json({ message: "Failed to fetch record" });
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

            console.log("book.borrowedBooksCount: "+book.borrowedBooksCount);

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

            res.status(201).json(record);
        } catch (err) {
            res.status(400).json({ message: (err as any).message });
        }
    }

    //toggleBadDebt
    static async toggleBadDebt(req: Request, res: Response) {
        try {
            const record = await BorrowRecord.findById(req.params.id);
            if (!record) return res.status(404).json({ message: "Record not found" });
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
        }catch (err) {console.log(err)}
    }

    //toggleReturned
    static async toggleReturned(req: Request, res: Response) {
        try {
            const record = await BorrowRecord.findById(req.params.id);
            if (!record) return res.status(404).json({ message: "Record not found" });
            const {ISBN, outstandingQty, isReturned, isBadDebt}= record;
            if(isBadDebt) return res.status(400).json({ message: "Bad debt record cannot be returned" });
            if (isReturned){
                await Book.findOneAndUpdate(
                    { ISBN: ISBN },
                    {
                        $inc: {
                            borrowedBooksCount: outstandingQty
                        }
                    },
                );
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
            console.log("isReturned: "+isReturned)
            await BorrowRecord.findByIdAndUpdate(req.params.id, { isReturned: !isReturned, returnDate: new Date(),outstandingQty: 0});
        }catch (err) {console.log(err)}
    }

    // update borrow record
    static async update(req: Request, res: Response) {
        try {
            const originalRecord:IBorrowRecord |null = await BorrowRecord.findById(req.params.id);
            console.log("borrow controller=> originalRecord:"+originalRecord);
            if(!originalRecord) return res.status(404).json({ message: "Record not found" });

            const { ISBN, outstandingQty, borrowerName, borrowDate, returnDate, isBadDebt, notes } = req.body;
            const book:IBook | null = await Book.findOne({ ISBN: originalRecord.ISBN });
            if (!book) return res.status(404).json({ message: "Book not found" });


            //console.log("book:"+book);


            //adjust book object
            //bad debt
            if(!originalRecord.isBadDebt && isBadDebt){
                console.log("suffered a bad debt");
                book.qtyOwned -= outstandingQty; //拥有量 - qty
                book.borrowedBooksCount-=originalRecord.outstandingQty;//借出量 - qty
            }
            //bad debt return
            else if(originalRecord.isBadDebt && !isBadDebt){
                book.qtyOwned += outstandingQty;
                book.borrowedBooksCount+=originalRecord.outstandingQty;
            }else {   // book returned
                console.log("originalRecord.qty - qty: "+ (originalRecord.outstandingQty - outstandingQty));
                // book.qtyOwned += (originalRecord.qty - qty);
                book.borrowedBooksCount -= (originalRecord.outstandingQty - outstandingQty);
            }

            console.log("req.params.id: ", req.params.id)
            console.log("req.body:"+req.body);
            console.log("book:"+book);
            //normal return
            await Book.findOneAndUpdate({ISBN: originalRecord.ISBN}, {qtyOwned: book.qtyOwned, borrowedBooksCount: book.borrowedBooksCount}, {new: true});
            //update BorrowRecord
            console.log("print after book.save() ")

            await BorrowRecord.findByIdAndUpdate(req.params.id, req.body);

            res.json({message: "Record updated"});

        } catch (err) {
            res.status(400).json({ message: "Failed to update record" });
        }
    }

    // delete borrow record & Restore stock quantity
    static async delete(req: Request, res: Response) {
        try {
            const record = await BorrowRecord.findById(req.params.id);
            if (!record) return res.status(404).json({ message: "Record not found" });

            // Restore stock quantity

            const book:IBook | null = await Book.findOne({ ISBN: record.ISBN });
            if (!book) return res.status(404).json({ message: "Book not found" });


            if(!record.isReturned && !record.isBadDebt) {
                book.qtyOwned-=record.outstandingQty;
                book.borrowedBooksCount-=record.outstandingQty
                await book.save();
            }

            await record.deleteOne();
            res.json({ message: "Record deleted..." });
        } catch (err) {
            res.status(500).json({ message: "Failed to delete record" });
        }
    }
}

export default BorrowRecordController;
