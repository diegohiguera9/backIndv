import ErrroResponse from "../utils/errorResponse";
import { Response, Request, NextFunction } from "express";

const errorHandler = (err: any, req: Request, res: Response,next: NextFunction) => {
  let error = { ...err };

  error.message = err.message;
  console.log(err)

  if (err.name === "ValidationError") {
    const message: any = Object.values(err.errors).map((val:any) => val.message);
    error = new ErrroResponse(message, 400);
  }

  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid Token';
    error = new ErrroResponse(message,400)
  }

  if(err.name === 'CastError') {
    const message = `Not valid ${err.valueType} in field ${err.path} `
    error = new ErrroResponse(message,400)
  }

  res
    .status(error.statusCode || 500)
    .json({ message: error.message || "Server Error"});
};

export default errorHandler
