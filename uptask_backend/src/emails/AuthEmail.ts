import { transporter } from "../config/nodemailer"
import { IEmail } from "../types"

export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        const { email, name, token } = user
        const info = await transporter.sendMail({
            from: "UpTask<admin@uptask.com>",
            to: user.email,
            subject: "UpTask - Confirma tu cuenta",
            text: "UpTask - Confirma tu cuenta",
            html: `<p>Hola: ${name}, has creado tu cuenta en UpTask, solo debes confirmar tu cuenta</p>
                <p>Visita el siguiente enlace: </p>
                <a href="${process.env.FRONDEND_URL}/auth/confirm-account">Confima tu cuenta</a>
                <p>Ingresa el código: <b>${token}</b></p>
                <p>Tienes 1 hora para verificar tu cuenta, si no la verificas esta cuenta se eliminara del servidor permanentemente</p>
            `
        })
    }

    static SendPasswordResetToken = async (user: IEmail) => {
        const { email, name, token } = user
        const info = await transporter.sendMail({
            from: "UpTask<admin@uptask.com>",
            to: user.email,
            subject: "UpTask - Reestablece tu contraseña",
            text: "UpTask - Reestablece tu contraseña",
            html: `<p>Hola: ${name}, has solicitado reestablecer tu contraseña.</p>
                <p>Visita el siguiente enlace: </p>
                <a href="${process.env.FRONDEND_URL}/auth/new-password">Reestablecer contraseña</a>
                <p>Ingresa el código: <b>${token}</b></p>
                <p>Tienes 10 minutos reestablecer tu contraseña</p>
            `
        })
    }
}