import { Router } from "express";
import { createProduct, updateProduct, destroyProduct, showProduct } from "./product.controller";
import { isAuthenticated } from "../../middleware/auth";
import { adminAuth } from "../../middleware/roleAuth";

const router = Router()

router.route('/create').post(isAuthenticated, adminAuth, createProduct)
router.route('/update/:id').post(isAuthenticated, adminAuth, updateProduct)
router.route('/delete/:id').delete(isAuthenticated, adminAuth, destroyProduct)
router.route('/show/:id').get(isAuthenticated, showProduct)

export default router;