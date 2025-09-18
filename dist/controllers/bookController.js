import Book from "../models/Book.js";
// get information of all users
export const getBooks = async (req, res) => {
    console.log("getBooks in bookController.ts:");
    try {
        const books = await Book.find();
        // console.log("bookController.getBooks => books:"+books);
        res.json(books);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to get books", error });
    }
};
//get the designated book by isbn
export const getBookByIsbn = async (req, res) => {
    try {
        const { isbn } = req.params;
        const book = await Book.findOne({ ISBN: isbn });
        res.status(201).json(book);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to add the book", error });
    }
};
// add a new book
export const createBook = async (req, res) => {
    try {
        const book = new Book(req.body);
        console.log("bookController.createBook.book:", book);
        //TODO only allow designated fields
        await book.save();
        res.status(201).json(book);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to add the book", error });
    }
};
// book update
export const updateBook = async (req, res) => {
    try {
        const { ISBN } = req.body;
        console.log(req.body);
        //TODO only allow designated fields
        const book = await Book.findOneAndUpdate({ ISBN: ISBN }, // query via ISBN
        req.body, { new: true });
        if (!book)
            return res.status(404).json({ message: "Book not found" });
        res.json(book);
    }
    catch (error) {
        res.status(400).json({ message: "Update failed", error });
    }
};
// delete a book
export const deleteBook = async (req, res) => {
    try {
        const { isbn } = req.params;
        const book = await Book.findOneAndDelete({ ISBN: isbn });
        if (!book)
            return res.status(404).json({ message: "Book not found" });
        res.json({ message: "Delete successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Deletion failed", error });
    }
};
//# sourceMappingURL=bookController.js.map