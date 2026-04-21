import { transporter } from '../config/nodemailer'

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async ( email: IEmail ) => {
              const info = await transporter.sendMail({
                from: 'UpTask <admin@rombo.com>',
                to: email.email,
                subject: 'UpTask - Confirma tu cuenta',
                text:  'UpTask - Confirma tu cuenta',
                html: `<p>Hola ${email.name}, has creado tu cuenta en UpTask, ya casi está 
                todo listo, solo debes confirmar tu cuenta.</p>
                <p>Visita el siguiente enlace <a href="${process.env.FRONTEND_URL}/auth/confirm-account">(confirmar cuenta)</a> e introduce el código <b>${email.token}</b></p>
                <p>Este token expira en 10 minutos</p>`
            })
    }

        static sendResetPasswordEmail = async ( email: IEmail ) => {
              const info = await transporter.sendMail({
                from: 'UpTask <admin@rombo.com>',
                to: email.email,
                subject: 'UpTask - Restablece tu contraseña',
                text:  'UpTask - Restablece tu contraseña',
                html: `<p>Hola ${email.name}, has solicitado restablecer tu contraseña.</p>
                <p>Visita el siguiente enlace <a href="${process.env.FRONTEND_URL}/auth/new-password">(restablecer contraseña)</a> e introduce el código <b>${email.token}</b></p>
                <p>Este token expira en 10 minutos</p>`
            })
    }
}