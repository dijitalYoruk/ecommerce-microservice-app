import { NextFunction, Request, Response } from "express"
import { NotAuthorizedError } from "../errors/notAuthorizedError"

export const authorize = (...roles) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const role = req.currentUserJWT?.role

        if (!roles.includes(role)) { // check role
            throw new NotAuthorizedError('Athorization Error');
        }

        next()
    }
}