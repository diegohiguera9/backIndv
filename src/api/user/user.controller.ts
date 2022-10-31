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
        res.status(200).json({token}).redirect('https://frontfogon.vercel.app/login/success')
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
        console.log(req.body)
        res.status(200).json({message:'ok'})
    } catch(err) {

    }
}