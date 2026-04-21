import jwt from 'jsonwebtoken' //viee de un export default, so, puedes llamarle jwt o como te rote
import {Types} from 'mongoose'

type UserPayload = {
    id: Types.ObjectId
}

export const generateJWT = (payload: UserPayload) => {

    //en .env está el valor del secret... una palabra o string a partir del que se gernerará el token
    //conviene hashearla... cuando esté en producción, estará en las variables de entorno, hasheada
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {   //payload, secret y opciones
        expiresIn: '180d'
          })                //refreshToken, dura toda la vida; si expiras, preguntas al usuario, quieres seguir conectado? y le envías otro.
                            //en un banco a lo mejor te lo preguntan a los 5 min, en Netflix al año
    return token
}