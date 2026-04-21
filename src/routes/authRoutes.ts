import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'
import { body, param } from 'express-validator'
import { handleInputError } from '../middleware/validation'
import { authenticate } from '../middleware/auth'

const router = Router()


router.post('/create-account',
    body('name')
        .notEmpty().withMessage('El nombre no puede estar vacío'),
    body('email')
        .isEmail().withMessage('El correo electrónico ha de tener un formato válido'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña ha de tener mínimo 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => { 
        if (value !== req.body.password) {               
            throw new Error('Las contraseñas no son iguales')
        }
        return true
    }),
    handleInputError,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('El token ha de tener contenido'),
    handleInputError,
    AuthController.confirmAccount
)

router.post('/login',
    body('email')
        .isEmail().withMessage('El correo electrónico ha de tener un formato válido'),
    body('password')
        .notEmpty().withMessage('La contraseña no puede estar vacía'),
    handleInputError,
    AuthController.login
)

router.post('/request-code',
    body('email')
        .isEmail().withMessage('El correo electrónico ha de tener un formato válido'),
    handleInputError,
    AuthController.requestNewCode
)

router.post('/reset-password',
    body('email')
        .isEmail().withMessage('El correo electrónico ha de tener un formato válido'),
    handleInputError,
    AuthController.resetPassword
)

router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('El token ha de tener contenido'),
    handleInputError,
    AuthController.validateToken
)

router.post('/update-password/:token',
    param('token')
        .isNumeric().withMessage('Token no válido'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña ha de tener mínimo 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no son iguales')
        }
        return true
    }),
    handleInputError,
    AuthController.updatePasswordWithToken
)

router.get('/user',
    authenticate,
    AuthController.getUser
)

/** Profile **/
router.put('/profile',
    authenticate,
    body('name')
        .notEmpty().withMessage('El nombre no puede estar vacío'),
    body('email')
        .isEmail().withMessage('El correo electrónico ha de tener un formato válido'),
    handleInputError,
    AuthController.updateProfile)

router.put('/update-password',
    authenticate,
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña ha de tener mínimo 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no son iguales')
        }
        return true
    }),
    body('currentPassword')
        .isEmpty().withMessage('La contraseña actual no puede estar vacía'),
    handleInputError,
    AuthController.updatePassword
)

router.post('/delete-check-password',
    authenticate,
    body('password')
        .notEmpty().withMessage('La contraseña no puede estar vacía'),
    handleInputError,
    AuthController.deleteCheckPassword
)

export default router