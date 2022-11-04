import Table,  { ITable } from "./table.model";
import { Request, Response, NextFunction } from "express";
import ErrroResponse from "../../utils/errorResponse";

export async function createTable(
    req: Request,
    res: Response,
    next: NextFunction
  ){
    try {
        const table = await Table.create(req.body)
        res.status(200).json({data:table})
    } catch(err){
        next(err)
    }
}

export async function showTables (
    req: Request,
    res: Response,
    next: NextFunction
  ){
    try {
        const tables = await Table.find()
        res.status(200).json({data:tables})
    } catch(err){
        next(err)
    }
}

export async function showOneTable (
    req: Request,
    res: Response,
    next: NextFunction
  ){
    try {
        const tableId = req.params.id
        const table = await Table.findById(tableId)
        if (!table) {
            return next(new ErrroResponse('no tables found',400))
        }
        res.status(200).json({data:table})
    } catch(err){
        next(err)
    }
}

export async function updateTable (
    req: Request,
    res: Response,
    next: NextFunction
  ){
    try {
        const tableId = req.params.id
        const table = await Table.findByIdAndUpdate(tableId, req.body, {new:true})
        if (!table) {
            return next(new ErrroResponse('no tables found',400))
        }
        res.status(200).json({data:table})
    } catch(err){
        next(err)
    }
}

export async function destroyTable (
    req: Request,
    res: Response,
    next: NextFunction
  ){
    try {
        const tableId = req.params.id
        const table = await Table.findByIdAndDelete(tableId)
        if (!table) {
            return next(new ErrroResponse('no tables found',400))
        }
        res.status(200).json({data:'table deleted'})
    } catch(err){
        next(err)
    }
}

export async function showType (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try{
        const queryType = req.query.type
        const floorType = req.query.floor
        const tables = await Table.find({type:queryType, floor:floorType})
        res.status(200).json({data:tables})
    } catch(err){
        next(err)
    }
  }

  export async function showNumber(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try{
        const tableNum = req.params.id
        const table = await Table.findOne({number:tableNum}).populate({
            path: 'order'
        })
        if(!table){
            return next(new ErrroResponse('no tables found',400))
        }
        res.status(200).json({data:table})
    } catch(err){
        next(err)
    }
  }