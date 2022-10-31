import ErrroResponse from "../utils/errorResponse";
import User, { IUser } from "../api/user/user.model";
import { Request, Response, NextFunction } from "express";

export async function adminAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user){
      return next()
    }
    if (req.body.user.role !== "admin")
      return next(new ErrroResponse("User no authorized", 404));
    next()
  } catch (err) {
    next(err)
  }
}
