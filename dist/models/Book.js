import { Schema, model, Document, Model } from "mongoose";
const bookSchema = new Schema({
    ISBN: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    qtyOwned: { type: Number, required: true, min: 0 },
    borrowedBooksCount: { type: Number, required: true, min: 0 },
    subtitle: { type: String, required: false },
    authors: { type: [String], required: false },
    publishDate: { type: String, required: false },
    description: { type: String, required: false },
    pageCount: { type: Number, required: false },
    categories: { type: [String], required: false },
    imageLink: { type: String, required: false },
    language: { type: String, required: false },
    pdfTokenLink: { type: String, required: false },
    webReaderLink: { type: String, required: false },
    shelfLocation: { type: [String], required: false, default: [] },
    isRecommended: { type: Boolean, required: false, default: false },
    isWishList: { type: Boolean, required: false, default: false },
    notes: { type: String, required: false },
}, { timestamps: true });
const Book = model("books", bookSchema);
export default Book;
// ISBN:string;
// title: string
// subtitle: string
// publishDate: string,
// description: string,
// pageCount: number,
// categories: string[],
// imageLink: string,
// language: string  // "en", "ch",
// qtyOwned: number,
// borrowedBooksCount: number//
// pdfTokenLink: string, // get PDF
// webReaderLink: string // Read Online (Google Play Books),
// shelfLocation:string
//# sourceMappingURL=Book.js.map