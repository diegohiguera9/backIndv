import Category, { ICategory } from "./category.model";
import { Request, Response, NextFunction } from 'express'
import ErrroResponse from '../../utils/errorResponse'

export async function createCategory (req: Request, res:Response, next:NextFunction) {
    try{
        const newCategory = req.body
        const category: ICategory = await Category.create(newCategory)
        res.status(200).json({data:category})
    } catch(err){
        next(err)
    }
}

export async function updateCategory (req: Request, res:Response, next:NextFunction) {
    try{
        const categoryId = req.params.id
        const category = await Category.findByIdAndUpdate(categoryId, req.body, {new:true})
        if(!category){
            return next(new ErrroResponse('No category found',400))
        }
        res.status(200).json({data: category})
    } catch(err){
        next(err)
    }
}

export async function destroyCategory (req: Request, res:Response, next:NextFunction) {
    try {
        const categoryId = req.params.id
        await Category.findByIdAndDelete(categoryId)
        res.status(200).json({message:'Category deleted'})
    } catch(err){
        next(err)
    }
}