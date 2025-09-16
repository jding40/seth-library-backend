import type { Request, Response } from "express";
import Book from "../models/Book.js";
import type { IBook } from "../models/Book.js";

// 获取所有图书
export const getBooks= async (req: Request, res: Response) => {
  console.log("getBooks in bookController.ts:");
  try {
    const books:IBook[]  = await Book.find();
    console.log("bookController.getBooks => books:"+books);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Failed to get books", error });
  }
};

//get book by isbn

export const getBookByIsbn = async(req: Request, res: Response) => {

  try{
    const { isbn } = req.params;
    const book:IBook|null  = await Book.findOne({ISBN:isbn});
    res.status(201).json(book);
  }catch (error) {
    res.status(400).json({ message: "Failed to add the book", error });
  }
}

// add a new book
export const createBook = async (req: Request, res: Response) => {
  try {
    const book = new Book(req.body);
    console.log("bookController.createBook.book:", book);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: "Failed to add the book", error });
  }
};

// book update
export const updateBook = async (req: Request, res: Response) => {
  try {
    const { ISBN } = req.body;
    console.log(req.body);
    const book = await Book.findOneAndUpdate(
      { ISBN: ISBN },  // 使用 ISBN 查找
      req.body,
      { new: true }
    );
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: "Update failed", error });
  }
};

// delete a book
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { isbn } = req.params;
    const book = await Book.findOneAndDelete( { ISBN: isbn },);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Delete successfully" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed", error });
  }
};