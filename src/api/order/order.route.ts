import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth";
import {
  createOrder,
  showOrder,
  updateOrder,
  upDeleteOrder,
  showStatus,
  updatePay,
  orderDay,
  orderReport,
  printResume,
  orderMap
} from "./order.controller";
import { ipPrinter } from "../../utils/printer";
import { ipPrinterDel } from "../../utils/printerDel";
import { ipPrinterResume } from "../../utils/printResume";

const router = Router();

router.route("/create").post(isAuthenticated, createOrder, );
router.route("/byday").post(isAuthenticated, orderDay);
router.route("/showOne/:id").get(isAuthenticated, showOrder);
router.route("/update/:id").put(isAuthenticated, updateOrder, );
router.route("/upDelete/:id").put(isAuthenticated, upDeleteOrder, );
router.route("/showStatus").get(isAuthenticated, showStatus);
router.route("/updateStatus/:id").put(isAuthenticated, updatePay);
router.route("/report").post(isAuthenticated, orderReport);
router.route("/printResume/:id").get(isAuthenticated, printResume,);
router.route('/orderMap').post(isAuthenticated, orderMap)

export default router;
