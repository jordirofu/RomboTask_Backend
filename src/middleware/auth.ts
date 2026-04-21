import type { Response, Request, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

type JwtPayload = {
    id: string
}


export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    const bearer = req.headers.authorization
    if (!bearer) {
        return next({
            status: 401,
            message: 'Usuario no autorizado'
        })
    }

    const [, token] = bearer.split(' ') 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
        const user = await User.findById(decoded.id).select('_id email name') 
        if (user) {                                                              
            req.user = user
            next()
        }
        else {
            return next({
                status: 404,
                message: 'Usuario no encontrado'
            })

        }
    } catch (error) {
        return next({
            status: 401,
            message: 'Token no válido o expirado'
        })
    }
}