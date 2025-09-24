import type { Request, Response } from 'express';
declare class BorrowRecordController {
    static getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static toggleBadDebt(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static handleReturn(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static delete(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
export default BorrowRecordController;
//# sourceMappingURL=BorrowRecordController.d.ts.map