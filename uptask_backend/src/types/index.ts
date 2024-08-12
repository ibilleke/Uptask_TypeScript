import { Document, Types, PopulatedDoc } from "mongoose"
import { TaskStatus } from "../models/Task"

/** Schema Structure */
export interface IProject extends Document {
    projectName: string
    clientName: string
    description: string
    tasks: PopulatedDoc<ITask & Document>[]
    manager: PopulatedDoc<IUser & Document>
    team: PopulatedDoc<IUser & Document>[]
}
export interface ITask extends Document {
    name: string
    description: string
    project: Types.ObjectId
    status: TaskStatus
    completedBy: {
        user: Types.ObjectId,
        status: TaskStatus
    }[]
    notes: Types.ObjectId[]
}
export interface IUser extends Document {
    email: string
    password: string
    name: string
    confirmed: boolean
}
export interface IToken extends Document {
    token: string
    user: Types.ObjectId
    createdAt: Date
}
export interface INote extends Document {
    content: string
    createdBy: Types.ObjectId
    task: Types.ObjectId
}

/** Params */
export interface NoteParams {
    noteId: Types.ObjectId
}

/** Datos */
export interface IEmail {
    email: string
    name: string
    token: string
}
export interface IUserPayload {
    id: Types.ObjectId
}