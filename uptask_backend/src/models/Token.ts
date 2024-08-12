import mongoose, {Schema, Types} from "mongoose"
import { IToken } from "../types"

const tokenSchema: Schema = new Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: "User"
    },
    expiresAt: {
        type: Date,
        default: Date.now(),
        expirs: "1h"
    }
})

const Token = mongoose.model<IToken>("token", tokenSchema)
export default Token