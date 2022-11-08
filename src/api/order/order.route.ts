import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth";
import { createOrder, showOrder, updateOrder, upDeleteOrder } from "./order.controller";

const router = Router()

router.route('/create').post(isAuthenticated, createOrder)
router.route('/showOne/:id').get(isAuthenticated, showOrder)
router.route('/update/:id').put(isAuthenticated, updateOrder)
router.route('/upDelete/:id').put(isAuthenticated, upDeleteOrder)

export default router