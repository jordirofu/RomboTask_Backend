import type { NextFunction, Request, Response } from 'express'
import User from '../models/User'
import { checkPassword, hashPassword } from '../utils/bcrypt'
import Token from '../models/Token'
import { generateToken } from '../utils/token'
import { AuthEmail } from '../emails/AuthEmail'
import { generateJWT } from '../utils/jwt'


export class AuthController {
    static createAccount = async (req: Request, res: Response, next: NextFunction) => {
        const { password, email } = req.body

        try {
            const userExists = await User.findOne({ email })
            if (userExists) {
                const error = new Error('Ya hay un usuario registrado con ese correo electrónico')
                return next({
                    status: 409,
                    message: 'Ya hay un usuario registrado con ese correo electrónico'
                })
            }

            const user = new User(req.body)
            user.password = await hashPassword(password)

            const token = new Token()
            token.token = generateToken()
            token.user = user._id

            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.all([user.save(), token.save()])
            res.send('Cuenta creada, revisa tu email para confirmarla')
        } catch (error) { 
            next(error) 
        }
    }

    static confirmAccount = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.body.token
        try {
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                return next({
                    status: 404,
                    message: 'Token no válido'
                })
            }

            const user = await User.findById(tokenExists.user)
            if (!user) {
                return next({
                    status: 404,
                    message: 'Usuario no encontrado'
                })
            }
            user.confirmed = true

            await Promise.all([user.save(), tokenExists.deleteOne()])
            res.send('Cuenta confirmada')
        } catch (error) {
            next(error)
        }
    }

    static login = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body
        try {
            const user = await User.findOne({ email })
            if (!user) {
                return next({
                    status: 404,
                    message: 'Usuario no encontrado'
                })
            }

            if (!user.confirmed) {
                const token = new Token()
                token.user = user._id
                token.token = generateToken()
                await token.save()

                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })
                return next({
                    status: 401,
                    message: 'La cuenta aún no ha sido confirmada, hemos enviado un nuevo email de confirmación'
                })
            }

            const isPasswordCorrect = await checkPassword(password, user.password)
            if (!isPasswordCorrect) {
                return next({
                    status: 403,
                    message: 'La contraseña es incorrecta'
                })
            }
            const token = generateJWT({ id: user._id })
            res.send(token)
        } catch (error) {
            next(error)
        }
    }

    static requestNewCode = async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body
        try {
            const user = await User.findOne({ email })
            if (!user) {
                return next({
                    status: 404,
                    message: 'Usuario no encontrado'
                })
            }
            if (user.confirmed) {
                return next({
                    status: 409,
                    message: 'La cuenta ya está confirmada, puedes entrar con tus credenciales'
                })
            }

            const token = new Token()
            token.token = generateToken()
            token.user = user._id

            await token.save()

            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })
            res.send('Nuevo código enviado')
        } catch (error) {
            next(error)
        }
    }

    static resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body
        try {
            const user = await User.findOne({ email })
            if (!user) {
                return next({
                    status: 404,
                    message: 'Usuario no encontrado'
                })
            }

            const token = new Token()
            token.token = generateToken()
            token.user = user._id

            AuthEmail.sendResetPasswordEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await token.save()
            res.send('Enviado email con instrucciones')
        } catch (error) {
            next(error)
        }
    }

    static validateToken = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.body.token
        try {
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                return next({
                    status: 404,
                    message: 'Token no válido'
                })
            }
            res.send('Token válido, define tu nueva contraseña')
        } catch (error) {
            next(error)
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.params.token
        const { password } = req.body

        try {
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                return next({
                    status: 404,
                    message: 'Token no válido'
                })
            }

            const user = await User.findById(tokenExists.user)
            if (!user) {
                return next({
                    status: 404,
                    message: 'Usuario no encontrado'
                })
            }
            user.password = await hashPassword(password)

            await Promise.all([user.save(), tokenExists.deleteOne()])
            res.send('Contraseña actualizada')
        } catch (error) {
            next(error)
        }
    }

    static getUser = async (req: Request, res: Response) => {
        return res.json(req.user)
    }

    static updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        const { name, email } = req.body
        try {
            const userExists = await User.findOne({ email })
            if (userExists && userExists._id.toString() != req.user._id.toString()) { //comprobar que no es el propio mail de quien hace la llamada
                return next({
                    status: 409,
                    message: 'El email indicado ya está registrado'
                })
            }
            req.user.name = name
            req.user.email = email
            await req.user.save()
            res.send('Perfil actualizado')

        } catch (error) {
            next(error)
        }
    }

    static updatePassword = async (req: Request, res: Response, next: NextFunction) => {

        const { password, current_password } = req.body

        try {
            const user = await User.findById(req.user._id)

            const isPasswordCorrect = await checkPassword(current_password, user!.password)
            console.log(isPasswordCorrect);
            if (!isPasswordCorrect) {
                  return next({
                    status: 401,
                    message: 'La contraseña actual no es correcta'
                })
            }

            req.user.password = await hashPassword(password)
            await req.user.save()
            res.send('Contraseña actualizada')

        } catch (error) {
            next(error)
        }
    }

    static deleteCheckPassword = async (req: Request, res: Response, next: NextFunction) => {

        const { password } = req.body

        try {
            const user = await User.findById(req.user._id)

            const isPasswordCorrect = await checkPassword(password, user!.password)
            if (!isPasswordCorrect) {
                  return next({
                    status: 401,
                    message: 'La contraseña actual no es correcta'
                })
            }
            res.send('Contraseña correcta')
        } catch (error) {
            next(error)
        }
    }
}


