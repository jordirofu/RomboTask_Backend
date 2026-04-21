import { HydratedDocument } from 'mongoose'
import { IUser } from '../models/User'
import { IProject } from '../models/Project'
import { ITask } from '../models/Task'
import { INote } from '../models/Note'

declare global {
    namespace Express {
        interface Request {
            user: HydratedDocument<IUser>
            project: HydratedDocument<IProject>
            task: HydratedDocument<ITask>
            note: HydratedDocument<INote>
        }
    }
}

export {}
