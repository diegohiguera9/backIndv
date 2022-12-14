import User, {IUser} from './user.model'
import { Request, Response, NextFunction } from 'express'
import ErrroResponse from '../../utils/errorResponse'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


function createToken (user: IUser) {
    return jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY as string, {
        expiresIn: 60 * 60 * 24,
      });
}

export async function signUp (req: Request, res:Response, next:NextFunction) {
    try{
        if(!req.body.password) return next(new ErrroResponse('Password required',400))
        const user: IUser =  await User.create(req.body)
        const token = createToken(user)
        res.status(200).json({token})
    } catch (err){
        next(err)
    }
}

export async function tokenOauth (req: Request, res:Response, next:NextFunction) {
    try{
        const user:any = req.user
        const token = createToken(user)
        res.redirect(`https://frontfogon.vercel.app/login/success/${token}`)
    } catch(err){
        next(err)
    }
}

export async function singIn (req: Request, res: Response, next: NextFunction) {
    try{
        const user = await User.findOne({email: req.body.email})

        if (!user) {
            return next(new ErrroResponse('No user found',400))
        }

        if(!user.password) {
            return next(new ErrroResponse('No password detected',400))
        }

        const isValid: boolean = await bcrypt.compare(req.body.password, user.password)

        if (!isValid) {
            return next(new ErrroResponse('No valid password',400))
        }

        const token = createToken(user)

        res.status(200).json({token})
    } catch (err){
        next(err)
    }
}

export async function show (req: Request, res: Response, next: NextFunction) {
    try {
        const users = await User.find()
        res.status(200).json({data:users})
    } catch(err) {
        next(err)
    }
}

export async function update (req: Request, res: Response, next: NextFunction) {
    try{
        const user: IUser | null = await User.findOne({email:req.body.email})

        if (!user){
            return next(new ErrroResponse('No User found',400))
        }

        const updateUser = await User.findByIdAndUpdate(user._id, req.body, {new:true})

        res.status(200).json({data:updateUser})

    } catch(err){
        next(err)
    }
}

export async function showOne (req: Request, res: Response, next: NextFunction) {
    try{
        const user = await User.findOne({email:req.body.email})
        if (!user){
            return next(new ErrroResponse('no user found',400))
        }
        res.status(200).json({data:user})
    } catch(err){
        next(err)
    }
}