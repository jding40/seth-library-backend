import { Router } from "express";
import { getBooks, getBookByIsbn, createBook, updateBook, deleteBook, updateShelf } from "../controllers/bookController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
const bookRouter = Router();
bookRouter.get("/", getBooks);
bookRouter.get("/:isbn", getBookByIsbn);
bookRouter.post("/", authenticate, authorize(["admin", "owner"]), createBook);
bookRouter.put("/", authenticate, authorize(["admin", "owner"]), updateBook);
bookRouter.delete("/:isbn", authenticate, authorize(["admin", "owner"]), deleteBook);
bookRouter.patch("/updateshelf/:isbn", authenticate, authorize(["admin", "owner"]), updateShelf);
export default bookRouter;
//# sourceMappingURL=bookRoutes.js.map