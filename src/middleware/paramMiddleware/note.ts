import type { Request, Response, NextFunction } from 'express'
import Note from '../../models/Note'
import { isValidObjectId } from 'mongoose';

export async function noteExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { noteId } = req.params
        if (!isValidObjectId(noteId)) {
            return next({
                status: 400,
                message: 'ID de nota no válido'
            })
        }
        const note = await Note.findById(noteId)
        if (!note) {
            return next({
                status: 404,
                message: 'Nota no encontrada'
            })
        }
        req.note = note
        next()

    } catch (error) {
        next(error)
    }
}

export async function noteBelongsToTask(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.note.task.toString() !== req.params.taskId) {
            return next({
                status: 400,
                message: 'Acción no valida. Nota y tarea no vinculados'
            })
        }
        next()

    } catch (error) {
        next(error)
    }
}

export async function hasAuthorizationOnNote(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.note.createdBy.toString() != req.user._id.toString()) {
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
