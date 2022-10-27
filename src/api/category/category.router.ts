import { Router } from "express";
import {
  createCategory,
  updateCategory,
  destroyCategory,
} from "./category.controller";
import { isAuthenticated } from "../../middleware/auth";
import { adminAuth } from "../../middleware/roleAuth";

const router = Router();

router.route("/create").post(isAuthenticated, adminAuth, createCategory);
router.route("/delete/:id").delete(isAuthenticated, adminAuth, destroyCategory);
router.route("/update/:id").post(isAuthenticated, adminAuth, updateCategory);

export default router;
