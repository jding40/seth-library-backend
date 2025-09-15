import { Document, Model } from "mongoose";
export interface IBook extends Document {
    ISBN: string;
    title: string;
    qtyOwned: number;
    borrowedBooksCount: number;
    subtitle?: string;
    authors?: string[];
    publishDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    imageLink?: string;
    language?: string;
    pdfTokenLink?: string;
    webReaderLink?: string;
    shelfLocation?: string;
    isRecommended?: boolean;
    isWishList?: boolean;
    notes?: string;
}
declare const Book: Model<IBook>;
export default Book;
//# sourceMappingURL=Book.d.ts.map