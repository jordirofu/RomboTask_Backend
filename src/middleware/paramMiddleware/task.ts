import type { Request, Response, NextFunction } from 'express'
import Task, { ITask } from '../../models/Task'
import { HydratedDocument, isValidObjectId } from 'mongoose'


export async function taskExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { taskId } = req.params

        if (!isValidObjectId(taskId)) {
            return next({
                status: 400,
                message: 'ID de tarea no válido'
            })
        }
        const task = await Task.findById(taskId)
        if (!task) {
            return next({
                status: 404,
                message: 'Tarea no encontrada'
            })
        }

        req.task = task
        next()

    } catch (error) {
        next(error)
    }
}

export async function taskBelongsToProject(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.task.project.toString() !== req.params.projectId) {
            return next({
                status: 400,
                message: 'Acción no valida. Tarea y proyecto no vinculados'
            })
        }
        next()

    } catch (error) {
        next(error)
    }
}

