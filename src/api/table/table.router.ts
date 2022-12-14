import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth";
import { adminAuth } from "../../middleware/roleAuth";
import { createTable, showTables, showOneTable, updateTable, destroyTable, showType, showNumber } from "./table.controller";

const router = Router()

router.route('/create').post(isAuthenticated, adminAuth, createTable)
router.route('/showAll').get(isAuthenticated, adminAuth, showTables)
router.route('/showType').get(isAuthenticated,showType )
router.route('/show/:id').get(isAuthenticated, adminAuth, showOneTable)
router.route('/update/:id').post(isAuthenticated, adminAuth, updateTable)
router.route('/delete/:id').delete(isAuthenticated, adminAuth, destroyTable)
router.route('/showNumber/:id').get(isAuthenticated, showNumber)

export default router