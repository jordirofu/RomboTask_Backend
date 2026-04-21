import type { Request, Response, NextFunction } from 'express'
import Project from '../../models/Project'
import { isValidObjectId } from 'mongoose'



export async function projectExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { projectId } = req.params
        if (!isValidObjectId(projectId)) {
            return next({
                status: 400,
                message: 'ID de proyecto no válido'
            })
        }
        const project = await Project.findById(projectId)
        if (!project) {
            return next({
                status: 404,
                message: 'Proyecto no encontrado'
            })
        }
        req.project = project
        next()
        
    } catch (error) {
        next(error)
    }
}

export async function hasManagerAuthorization(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.project.manager.toString() !== req.user.id.toString()) {
            return next({
                status: 403,
                message: 'Acción no permitida'
            })
        }
        next()

    } catch (error) {
        next(error)
    }
}
