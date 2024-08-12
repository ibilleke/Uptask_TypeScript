import type {Request, Response} from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"
import { generarJWT } from "../utils/jwt"

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email} = req.body
            // Prevenir duplicados
            const userExists = await User.findOne({email})
            if(userExists) {
                const error = new Error("El correo electrónico ya esta en uso")
                return res.status(409).json({error: error.message})
            }
            // Crea el usuario
            const user = new User(req.body)
            // Hash Password
            user.password = await hashPassword(password)
            // Generar Token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            // Envía el email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })
            await Promise.allSettled([user.save(), token.save()])
            res.send("La cuenta fue creada correctamente, hemos enviado un correo para que verifiques tu cuenta")
        } catch (error) {
            res.status(500).json({error: "Hubo un error al crear la cuenta"})
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({token})
            if(!tokenExists) {
                const error = new Error("Token no válido")
                return res.status(404).json({error: error.message})
            }
            const user = await User.findById(tokenExists.user)
            user.confirmed = true
            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send("Cuenta confirmada correctamente")
        } catch (error) {
            res.status(500).json({error: "Hubo un error al confirmar la cuenta"})
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body
            const user = await User.findOne({email})
            if(!user) {
                const error = new Error("Usuario no encontrado")
                return res.status(404).json({error: error.message})
            }
            if(!user.confirmed) {
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()
                // Envía el email
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })
                const error = new Error("La cuenta no ha sido verificada, hemos enviado un correo electrónico de verificación")
                return res.status(401).json({error: error.message})
            }
            // Revisar password
            const isPasswordCorrect = await checkPassword(password, user.password)
            if(!isPasswordCorrect) {
                const error = new Error("Contraseña incorrecta")
                return res.status(404).json({error: error.message})
            }
            const token = generarJWT({id: user._id})
            res.send(token)
        } catch (error) {
            res.status(500).json({error: "Hubo un error al ingresar a la cuenta"})
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            // Verifica si existe usuario
            const {email} = req.body
            const user = await User.findOne({email})
            if(!user) {
                const error = new Error("Usuario no registrado")
                return res.status(404).json({error: error.message})
            }
            if(user.confirmed) {
                const error = new Error("El usuario ya esta confirmado")
                return res.status(403).json({error: error.message})
            }
            // Generar Token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            // Envía el email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })
            await Promise.allSettled([user.save(), token.deleteOne()])
            res.send("Se envío un nuevo token a tu correo electrónico")
        } catch (error) {
            res.status(500).json({error: "Hubo un error al enviar un nuevo token"})
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const {email} = req.body
            // Verifica si existe usuario
            const user = await User.findOne({email})
            if(!user) {
                const error = new Error("Usuario no registrado")
                return res.status(404).json({error: error.message})
            }
            // Generar Token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()
            // Envía el email
            AuthEmail.SendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })
            res.send("Se envío un correo electrónico para reestablecer tu contraseña")
        } catch (error) {
            res.status(500).json({error: "Hubo un error al enviar un nuevo token"})
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({token})
            if(!tokenExists) {
                const error = new Error("Token no válido")
                return res.status(404).json({error: error.message})
            }
            res.send("Token válido, Define tu nueva contraseña")
        } catch (error) {
            res.status(500).json({error: "Hubo un error al confirmar la cuenta"})
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params
            const { password } = req.body
            const tokenExists = await Token.findOne({token})
            if(!tokenExists) {
                const error = new Error("Token no válido")
                return res.status(404).json({error: error.message})
            }
            const user = await User.findById(tokenExists.user)
            user.password = await hashPassword(password)
            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send("Contraseña actualizada correctamente")
        } catch (error) {
            res.status(500).json({error: "Hubo un error al confirmar la cuenta"})
        }
    }

    static user = async (req: Request, res: Response) => {
        return res.json(req.user)
    }

    static updateProfile = async (req: Request, res: Response) => {
        const {name, email} = req.body
        const userExists = await User.findOne({email})
        if(userExists && userExists.id.toString() !== req.user.id.toString()) {
            const error = new Error("Ese email ya esta registrado")
            return res.status(409).json({error: error.message})
        }
        req.user.name = name
        req.user.email= email
        try {
            await req.user.save()
            res.send("Perfil actualizado correctamente")
        } catch (error) {
            res.status(500).json({error: "Hubo un error al confirmar la cuenta"})
        }
    }

    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        const {current_password, password} = req.body
        const user = await User.findById(req.user.id)
        const isPasswordCorrect = await checkPassword(current_password, user.password)
        if(!isPasswordCorrect) {
            const error = new Error("La contraseña actual es incorrecta")
            return res.status(401).json({error: error.message})
        }
        try {
            user.password = await hashPassword(password)
            await user.save()
            res.send("La contraseña se modificó correctamente")
        } catch (error) {
            res.status(500).json({error: "Hubo un error al cambiar la contraseña"})
        }
    }

    static checkPassword = async (req: Request, res: Response) => {
        const {password} = req.body
        const user = await User.findById(req.user.id)
        const isPasswordCorrect = await checkPassword(password, user.password)
        if(!isPasswordCorrect) {
            const error = new Error("La contraseña es incorrecta")
            return res.status(401).json({error: error.message})
        }
        res.send("Contrseña correcta")
    }
}