import type { Request, Response, NextFunction } from "express"
import Project from "../models/Project"
import { IProject } from "../types"

declare global {
    namespace Express {
        interface Request {
            project: IProject
        }
    }
}

export async function projectExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { projectId } = req.params
        const project = await Project.findById(projectId)
        if(!project) {
            const error = new Error("Proyecto no Encontrado")
            return res.status(404).json({error: error.message})
        }
        req.project = project
        next()
    } catch (error) {
        res.status(500).json({error: "Hubo un Error"})
    }
}