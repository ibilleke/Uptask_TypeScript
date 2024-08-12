import jwt from "jsonwebtoken"
import { IUserPayload } from "../types"

export const generarJWT = (payload: IUserPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "30d"
    })
    return token
}