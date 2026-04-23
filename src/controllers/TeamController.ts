import type { NextFunction, Request, Response } from 'express'
import User from '../models/User'
import Project from '../models/Project'

export class TeamMemberController {

    static findMemberByEmail = async (req: Request, res: Response, next: NextFunction) => {

        const { email } = req.body
        try {
            const user = await User.findOne({ email }).select('_id name email')
            if (!user) {
                return next({
                    status: 404,
                    message: 'Usuario no encontrado'
                })
            }
            res.json(user)
        } catch (error) {
            next(error)
        }
    }

    static addMemberById = async (req: Request, res: Response, next: NextFunction) => {

        const { id } = req.body
        try {
            const user = await User.findById(id).select('_id')
            if (req.project.manager.toString() !== req.user.id.toString()) {
                return next({
                    status: 403,
                    message: 'Acción no permitida'
                })
            }
            if (!user) {
                return next({
                    status: 404,
                    message: 'Usuario no encontrado'
                })
            }
            if (req.project.team.some(team => team.toString() === user.id.toString())) {
                return next({
                    status: 409,
                    message: 'El usuario ya es un colaborador del proyectoo'
                })
            }
            req.project.team.push(user._id)
            await req.project.save()
            res.send(`Colaborador añadido a ${req.project.projectName}`)
        } catch (error) {
            next(error)
        }

    }

    static deleteMember = async (req: Request, res: Response, next: NextFunction) => {

        const { memberId } = req.params
        try {
            const user = await User.findById(memberId).select('_id')
            if (req.project.manager.toString() !== req.user.id.toString()) {
                return next({
                    status: 403,
                    message: 'Acción no permitida'
                })
            }
            if (!user) {
                return next({
                    status: 404,
                    message: 'Usuario no encontrado'
                })
            }
            if (!req.project.team.some(team => team.toString() === user.id.toString())) {
                return next({
                    status: 409,
                    message: 'El usuario no pertenece al proyecto'
                })
            }
            req.project.team = req.project.team.filter(team => team.toString() !== user.id.toString())
            await req.project.save()
            res.send(`Usuario eliminado de ${req.project.projectName}`)
        } catch (error) {
            next(error)
        }
    }

    static getMembersByProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const project = await Project.findById(req.project.id).populate({
                path: 'team',
                select: 'id email name'
            })
            res.json(project!.team)

        } catch (error) {
            next(error)
        }
    }
}