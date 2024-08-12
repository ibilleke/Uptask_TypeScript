import { Request, Response } from "express"
import User from "../models/User"
import Project from "../models/Project"

export class TeamMemberController {
    static addMemberById = async (req: Request, res: Response) => {
        const { id } = req.body
        // Busca el usuario por el id
        const user = await User.findById(id).select("id")
        if(!user) {
            const error = new Error("Usuario no encontrado")
            return res.status(404).json({error: error.message})
        }
        if(req.project.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error("El colaborador ya existe en este proyecto")
            return res.status(409).json({error: error.message})
        }
        req.project.team.push(user.id)
        await req.project.save()
        res.json("Colaborador agregado correctamente")
    }

    static getProjectTeam = async (req: Request, res: Response) => {
        const project = await Project.findById(req.project.id).populate({
            path: "team",
            select: "id email name"
        })
        res.json(project.team)
    }

    static findMemberByEmail = async (req: Request, res: Response) => {
        const {email} = req.body
        // Busca el usuario por el email
        const user = await User.findOne({email}).select("id email name")
        if(!user) {
            const error = new Error("Usuario no encontrado")
            return res.status(404).json({error: error.message})
        }
        res.json(user)
    }


    static deleteMemberByID = async (req: Request, res: Response) => {
        const { userId } = req.params
        if(!req.project.team.some(team => team.toString() === userId)) {
            const error = new Error("El usuario no existe en este proyecto")
            return res.status(409).json({error: error.message})
        }
        req.project.team = req.project.team.filter(team => team.toString() !== userId)
        await req.project.save()
        res.json("Colaborador eliminado correctamente")
    }
}