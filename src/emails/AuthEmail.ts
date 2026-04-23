import { transporter } from "../config/nodemailer";


interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async (email: IEmail) => {
    try {
      const response = await transporter.sendMail({
        from: "RomboTask <jordirofu@gmail.com>", 
        to: email.email,
        subject: "RomboTask - Confirma tu cuenta",
        html: `
          <p>Hola ${email.name}, has creado tu cuenta en RomboTask, ya casi está todo listo.</p>
          <p>
            Visita el siguiente enlace <a href="${process.env.FRONTEND_URL}/auth/confirm-account">(confirmar cuenta)
            </a> e introduce el código <b>${email.token}</b>
          </p>
          <p>Este token expira en 10 minutos</p>
        `,
      })

    } catch (error) {
      throw error
    }
  };

  static sendResetPasswordEmail = async (email: IEmail) => {
    try {
      const response = await transporter.sendMail({
        from: "RomboTask <jordirofu@gmail.com>",
        to: email.email,
        subject: "RomboTask - Restablece tu contraseña",
        html: `
          <p>Hola ${email.name}, has solicitado restablecer tu contraseña.</p>
          <p>
            Visita el siguiente enlace <a href="${process.env.FRONTEND_URL}/auth/new-password">(restablecer contraseña)
            </a> e introduce el código <b>${email.token}</b>
          </p>
          <p>Este token expira en 10 minutos</p>
        `,
      })

    } catch (error) {
      throw error
    }
  }
}
