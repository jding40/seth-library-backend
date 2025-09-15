import type { Request, Response } from 'express';
declare class BorrowRecordController {
    static getAll(req: Request, res: Response): Promise<void>;
    static getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static delete(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
export default BorrowRecordController;
//# sourceMappingURL=BorrowRecordController.d.ts.map