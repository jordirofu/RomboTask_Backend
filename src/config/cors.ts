import { CorsOptions } from 'cors'

export const corsConfig: CorsOptions = {

    origin: function (origin, callback) {
    console.log(`¿Es el origen "${origin}" igual a "${process.env.FRONTEND_URL}"?`)
    if (origin === process.env.FRONTEND_URL || !origin) {
        callback(null, true)
    } else {
        callback(new Error('Error de CORS'))
    }
}
}
