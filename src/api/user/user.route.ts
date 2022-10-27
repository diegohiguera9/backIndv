import { Router } from "express";
import { signUp, singIn,show } from "./user.controller";
import { isAuthenticated } from "../../middleware/auth";

const router = Router()

router.route("/signup").post(signUp)
router.route('/signin').post(singIn)
router.route('/show').get(isAuthenticated,show)

export default router
