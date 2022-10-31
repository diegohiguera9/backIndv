import { Request, Response, NextFunction } from 'express'
import ErrroResponse from '../utils/errorResponse'

export default async function googleAuth(req: Request, res:Response, next:NextFunction){
    try{
        if(req.user){
            req.body.user = req.user
            return next()
        } else {
            return next(new ErrroResponse('No authorized',406))
        }
    } catch(err){
        next(err)
    }
}