import { Router } from "express";
import { createProduct, updateProduct, destroyProduct, showProduct, showProducts } from "./product.controller";
import { isAuthenticated } from "../../middleware/auth";
import { adminAuth } from "../../middleware/roleAuth";
import formData from "../../utils/formData";

const router = Router()

router.route('/create').post(isAuthenticated, adminAuth, formData,createProduct)
router.route('/showAll').get(isAuthenticated, adminAuth, showProducts)
router.route('/update/:id').post(isAuthenticated, adminAuth, formData, updateProduct)
router.route('/delete/:id').delete(isAuthenticated, adminAuth, destroyProduct)
router.route('/show/:id').get(isAuthenticated, showProduct)

export default router;