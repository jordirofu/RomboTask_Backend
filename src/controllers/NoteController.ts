import type { NextFunction, Request, Response } from 'express'
import Note, { INote } from '../models/Note'


export class NoteController {

    static createNote = async (req: Request<{}, {}, INote>, res: Response, next: NextFunction) => {
        const { content } = req.body

        const note = new Note({ content })
        note.createdBy = req.user._id
        note.task = req.task._id

        req.task.notes.push(note._id)

        try {
            await Promise.all([note.save(), req.task.save()])
            res.send("Nota creada")

        } catch (error) {
            next(error)
        }
    }

    static getNotesByTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const notes = await Note.find({ task: req.task.id }).populate('createdBy')
            res.json(notes)

        } catch (error) {
            next(error)
        }
    }

    static deleteNote = async (req: Request, res: Response, next: NextFunction) => {

        req.task.notes = req.task.notes.filter((note) => note.toString() !== req.note._id.toString())

        try {
            await Promise.all([req.task.save(), req.note.deleteOne()])
            res.send('Nota eliminada')

        } catch (error) {
            next(error)
        }
    }
}