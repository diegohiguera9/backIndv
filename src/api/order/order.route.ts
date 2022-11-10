import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth";
import { createOrder, showOrder, updateOrder, upDeleteOrder, showStatus, updatePay, orderDay } from "./order.controller";

const router = Router()

router.route('/create').post(isAuthenticated, createOrder)
router.route('/byday').get(isAuthenticated,orderDay)
router.route('/showOne/:id').get(isAuthenticated, showOrder)
router.route('/update/:id').put(isAuthenticated, updateOrder)
router.route('/upDelete/:id').put(isAuthenticated, upDeleteOrder)
router.route('/showStatus').get(isAuthenticated,showStatus )
router.route('/updateStatus/:id').put(isAuthenticated, updatePay)

export default router