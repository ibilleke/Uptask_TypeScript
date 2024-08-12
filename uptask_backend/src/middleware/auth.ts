import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../models/User"
import { IUser } from "../types"

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
    if(!bearer) {
        const error = new Error("Acceso denegado")
        return res.status(401).json({error: error.message})
    }
    const [,token] = bearer.split(" ")
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(typeof decoded === "object" && decoded.id) {
            const user = await User.findById(decoded.id).select("_id name email")
            if(user) {
                req.user = user
                next()
            } else {
                return res.status(500).json({error: "Token no válido"})
            }
        }
    } catch (error) {
        res.status(500).json({error: "Token no válido"})
    }
}