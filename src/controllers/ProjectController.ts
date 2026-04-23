import type { NextFunction, Request, Response } from 'express'
import Project from '../models/Project'


export class ProjectController {

    static createProject = async (req: Request, res: Response, next: NextFunction) => {
        
        const project = new Project(req.body)  
        project.manager = req.user._id 
        try {
            await project.save()
            res.send('Proyecto creado')

        } catch (error) {
            next(error)
        }

    }

    static getAllprojects = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const projects = await Project.find({
                $or: [
                    { manager: req.user.id },
                    { team: req.user.id }
                ]
            })
            res.json(projects)

        } catch (error) {
            next(error)
        }
    }

    static getProjectById = async (req: Request, res: Response, next: NextFunction) => {

        try {
              const project = await Project.findById(req.project._id).populate('tasks')
            if (project) { 
                if (project.manager.toString() !== req.user._id.toString() &&
                    !project.team.includes(req.user._id)) { 
                    return next({
                        status: 403,
                        message: 'Acción no permitida'
                    })
                }
            }
            res.json(project)
        } catch (error) {
            next(error)
        }
    }

    static updateProjectById = async (req: Request, res: Response, next: NextFunction) => {
        const project = req.project

        project.description = req.body.description;
        project.projectName = req.body.projectName;
        project.clientName = req.body.clientName

        try {
            await project.save()
            res.send('Proyecto actualizado')
        } catch (error) {
            next(error)
        }
    }

    static deleteProjectById = async (req: Request, res: Response, next: NextFunction) => {
        const project = req.project

        try {
            await project.deleteOne()
            res.send('Proyecto borrado')
        } catch (error) {
            next(error)
        }
    }
}