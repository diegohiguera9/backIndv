import jwt, {JwtPayload} from 'jsonwebtoken'
import ErrroResponse from '../utils/errorResponse';
import { Request, Response, NextFunction } from 'express'
import User, { IUser } from '../api/user/user.model';

export interface UserPayload {
  id: string;
  role: string;
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return next(new ErrroResponse("No header provided", 400));
    }

    const [_, token] = authorization.split(" ");

    if (!token) {
      return next(new ErrroResponse("No token provided", 400));
    }  

    const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as UserPayload;
    // (req as CustomRequest).token = decoded;

    req.body.userId = decoded.id
    req.body.userRole = decoded.role   

    const user: IUser | null = await User.findById(decoded.id)
    req.body.user = user

    next();
  } catch (err) {
    next(err);
  }
};
