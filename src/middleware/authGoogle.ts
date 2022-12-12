import passport from "passport";
import strategy from 'passport-google-oauth20'
import User, { IUser } from "../api/user/user.model";

const GoogleStrategy = strategy.Strategy

const GOOGLE_CALLBACK = 'https://backindv-production.up.railway.app/user/auth/google/callback'

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID || ' ',
    clientSecret: process.env.GOOGE_SECRET || ' ',
    callbackURL: GOOGLE_CALLBACK,
    passReqToCallback: true
}, async (req, accestoken, refreshToken, profile, cb)=>{

    if(!profile.emails){
        return 
    }

    const user: IUser | null = await User.findOne({email:profile.emails[0].value})

    if(!user){
        const user2: IUser = await User.create({
            name: `${profile.name?.givenName}`,
            email: profile.emails[0].value, 
            role:'basic'
        })
        return cb(null, user2)
    }

    if(user){
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