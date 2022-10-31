import passport from "passport";
import strategy from 'passport-google-oauth20'
import User, { IUser } from "../api/user/user.model";

const GoogleStrategy = strategy.Strategy

const GOOGLE_CALLBACK = 'https://diegohtop24.herokuapp.com/user/auth/google/callback'

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID || ' ',
    clientSecret: process.env.GOOGE_SECRET || ' ',
    callbackURL: GOOGLE_CALLBACK,
    passReqToCallback: true
}, async (req, accestoken, refreshToken, profile, cb)=>{

    if(!profile.emails){
        return 
    }

    const defaultUser:IUser = {
        name: `${profile.name?.givenName}`,
        email: profile.emails[0].value, 
        role:'basic'
    }

    const user: IUser | null = await User.findOne({email:defaultUser.email})

    if(!user){
        const user2: IUser = await User.create(defaultUser)
        req.body.user = user2
        return cb(null, user2)
    }

    if(user){
        req.body.user = user
        return cb(null,user)
    }

}))

passport.serializeUser((user:any,cb)=>{
    return cb(null,user._id)
})

passport.deserializeUser(async (id,cb)=>{
    const user: IUser | null = await User.findOne({_id:id})
    if (user) return cb(null,user)
})