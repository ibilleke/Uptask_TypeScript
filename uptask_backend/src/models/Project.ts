import mongoose, { Schema, Types } from "mongoose"
import type { IProject } from "../types"
import Task from "./Task"
import Note from "./Note"

const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        require: true,
        trim: true
    },
    clientName: {
        type: String,
        require: true,
        trim: true
    },
    description: {
        type: String,
        require: true,
        trim: true
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: "Task"
        }
    ],
    manager: {
        type: Types.ObjectId,
        ref: "User"
    },
    team: [
        {
            type: Types.ObjectId,
            ref: "User"
        }
    ],
}, {
    timestamps: true
})

// Middleware
ProjectSchema.pre("deleteOne", 
    {
        document: true,
        query: false
    },
    async function() {
        const projectId = this._id
        if(!projectId) return
        const tasks = await Task.find(({project: projectId}))
        for(const task of tasks) {
            await Note.deleteMany({task: task.id})
        }
        await Task.deleteMany({project: projectId})
    }
)

const Project = mongoose.model<IProject>("Project", ProjectSchema)
export default Project