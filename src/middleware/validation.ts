import type { Response, Request, NextFunction} from 'express'
import { validationResult } from 'express-validator';


export const handleInputError = (req: Request, res: Response, next: NextFunction) => {
        let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next({
            status: 400,
            message: "Errores de validación",
            errors: errors.array()
        })

    }
    next();

}