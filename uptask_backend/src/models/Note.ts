import mongoose, { Schema, Types } from "mongoose"
import { INote } from "../types"

const NoteSchema: Schema = new Schema({
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    task: {
        type: Types.ObjectId,
        ref: "Task",
        required: true
    }
}, {
    timestamps: true
})

const Note = mongoose.model<INote>("Note", NoteSchema)
export default Note