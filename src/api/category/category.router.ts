import { Router } from "express";
import {
  createCategory,
  updateCategory,
  destroyCategory,
  showCategorys,
  showCategory
} from "./category.controller";
import { isAuthenticated } from "../../middleware/auth";
import { adminAuth } from "../../middleware/roleAuth";

const router = Router();

router.route("/create").post(isAuthenticated, adminAuth, createCategory);
router.route('/showAll').get(isAuthenticated, adminAuth, showCategorys)
router.route("/delete/:id").delete(isAuthenticated, adminAuth, destroyCategory);
router.route("/update/:id").post(isAuthenticated, adminAuth, updateCategory);
router.route('/showOne/:id').get(isAuthenticated, adminAuth, showCategory)


export default router;
