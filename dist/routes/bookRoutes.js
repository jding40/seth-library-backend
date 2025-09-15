import { Router } from "express";
import { getBooks, createBook, updateBook, deleteBook, } from "../controllers/bookController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
const bookRouter = Router();
bookRouter.get("/", getBooks);
bookRouter.post("/", authenticate, authorize(["admin"]), createBook);
bookRouter.put("/", authenticate, authorize(["admin"]), updateBook);
bookRouter.delete("/:isbn", authenticate, authorize(["admin"]), deleteBook);
export default bookRouter;
//# sourceMappingURL=bookRoutes.js.map