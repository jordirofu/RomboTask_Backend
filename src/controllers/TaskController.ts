import type { NextFunction, Request, Response } from 'express';
import Task from '../models/Task';


export class TaskController {




    static createTask = async (req: Request, res: Response, next: NextFunction) => {

        const task = new Task(req.body)
        task.project = req.project._id 
        req.project.tasks.push(task._id)

        try {
            await Promise.all([await task.save(), await req.project.save()])
            res.send('Tarea creada')
        } catch (error) {
            next(error)
        }
    }

    static getTasks = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const tasks = await Task.find({ project: req.project._id })
            res.json(tasks)
        } catch (error) {
            next(error)
        }
    }

    static getTaskById = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const task = await Task.findById(req.task._id)
                .populate({ path: 'statusModifiedBy.user', select: 'id name email' })
                .populate({         //Ejemplo de POPULATE ANIDADO
                    path: 'notes',
                    populate: {
                        path: 'createdBy',
                        select: 'id name email'
                    }
                })
            res.json(task)
        } catch (error) {
            next(error)
        }
    }

    static updateTaskById = async (req: Request, res: Response, next: NextFunction) => {

        if (req.project.manager.toString() !== req.user.id.toString()) {
            return next({
                status: 403,
                message: 'Acción no permitida'
            })
        }
        req.task.name = req.body.name
        req.task.description = req.body.description
        try {
            await req.task.save()
            res.send('Tarea actualizada')
        } catch (error) {
            next(error)
        }
    }

    static deleteTaskById = async (req: Request, res: Response, next: NextFunction) => {

        if (req.project.manager.toString() !== req.user.id.toString()) {
            return next({
                status: 403,
                message: 'Acción no permitida'
            })
        }
  
        req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task.id)
  
        try {
            await Promise.all([req.task.deleteOne(), req.project.save()])
            res.send('Tarea eliminada')

        } catch (error) {
            next(error)
        }
    }

    static updateStatus = async (req: Request, res: Response, next: NextFunction) => {

        const status = req.body.status
        req.task.status = status
        req.task.statusModifiedBy.push({ user: req.user._id, status })
        try {
            await req.task.save()
            res.send('Estado actualizado')
        } catch (error) {
            next(error)
        }
    }
}