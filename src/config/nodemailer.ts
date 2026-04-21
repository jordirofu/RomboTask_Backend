import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import dotenv from 'dotenv'

dotenv.config()

const config = (): SMTPTransport.Options => (
    {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    }
)

export const transporter = nodemailer.createTransport(config())

