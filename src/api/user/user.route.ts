import { Router } from "express";
import { signUp, singIn,show, tokenOauth, update, showOne } from "./user.controller";
import { isAuthenticated } from "../../middleware/auth";
import { adminAuth } from "../../middleware/roleAuth";
import passport from "passport";
import googleAuth from "../../middleware/reqGoogle";

const router = Router()

router.route("/signup").post(signUp)
router.route('/signin').post(singIn)
router.route('/show').get(isAuthenticated,adminAuth,show)
router.route('/showOne').post(isAuthenticated,adminAuth,showOne)
router.route('/update').post(update)

router.route('/login/google').get(passport.authenticate('google',{scope:['profile','email']}))

router.route('/auth/google/callback').get(passport.authenticate('google', {
    failureMessage:'Cannot login to this page',
    failureRedirect: 'https://frontfogon.vercel.app',
    successRedirect: 'https://diegohtop24.herokuapp.com/user/token',
    session: true,
}),
(req,res)=>{
    console.log('User',req.user)
    res.send('Thanks for signgin')
}
)

router.route('/token').get(googleAuth, tokenOauth)

export default router
