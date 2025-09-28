import express from "express";
import menuController from "../controllers/menuController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate, validateObjectId, menuFilterSchema, menuItemSchema } from "../utils/validators.js";

const router = express.Router();

// Public routes з валідацією query параметрів
router.get("/", validate(menuFilterSchema, "query"), menuController.getAllItems);
router.get("/popular", menuController.getPopularItems);
router.get("/featured", menuController.getFeaturedItems);
router.get("/categories", menuController.getCategories);
router.get("/:id", validateObjectId, menuController.getItemById);

// Admin routes
router.use(authenticate, authorize("admin", "manager"));
router.post("/", validate(menuItemSchema), menuController.createItem);
router.put("/:id", validateObjectId, validate(menuItemSchema), menuController.updateItem);
router.delete("/:id", validateObjectId, menuController.deleteItem);

export default router;
