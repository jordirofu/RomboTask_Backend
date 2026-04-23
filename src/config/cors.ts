import { CorsOptions } from 'cors'

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        const frontendUrl = process.env.FRONTEND_URL;
        if (!origin || origin === frontendUrl) {
            callback(null, true);
        } else {
            callback(new Error('Error de CORS'));
        }
    }
}
