import { Router } from "express";
import { signUp, singIn,show, tokenOauth } from "./user.controller";
import { isAuthenticated } from "../../middleware/auth";
import passport from "passport";
import googleAuth from "../../middleware/reqGoogle";

const router = Router()

router.route("/signup").post(signUp)
router.route('/signin').post(singIn)
router.route('/show').get(isAuthenticated,show)

router.route('/login/google').get(passport.authenticate('google',{scope:['profile','email']}))

router.route('/auth/google/callback').get(passport.authenticate('google', {
    failureMessage:'Cannot login to this page',
    failureRedirect: 'https://frontfogon.vercel.app',
    successRedirect: 'https://frontfogon.vercel.app/login/success',
    session: true,
}),
(req,res)=>{
    console.log('User',req.user)
    res.send('Thanks for signgin')
}
)

router.route('/token').get(passport.authenticate('google',{scope:['profile','email']}), googleAuth, tokenOauth)

export default router
