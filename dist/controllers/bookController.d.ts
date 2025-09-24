import type { Request, Response } from "express";
export declare const getBooks: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getBookByIsbn: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createBook: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateBook: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteBook: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=bookController.d.ts.map