import mongoose, { Schema, Types } from 'mongoose'
import { IProject } from './Project'
import { IUser } from './User'
import Note from './Note'

const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed'
} as const 

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]


export interface ITask {  
    name: string
    description: string
    project: Types.ObjectId | IProject, 
    status: TaskStatus
    statusModifiedBy: {     
        user: Types.ObjectId | IUser,
        status: TaskStatus
    }[],  
    notes: Types.ObjectId[]

}

const TaskSchema: Schema = new Schema<ITask>({     
    name: {
        type: String, 
        required: true,  
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    project: {  
        type: Schema.Types.ObjectId,  
        ref: 'Project'  
    },
    status: {
        type: String,
        enum: Object.values(taskStatus), 
        default: taskStatus.PENDING
    },
    statusModifiedBy: [
        {
            user: {
                type: Types.ObjectId,
                ref: 'User',
                default: null 
            },
            status: {
                type: String,
                enum: Object.values(taskStatus),
                default: taskStatus.PENDING
            }
        }],
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Note'
        }
    ]


}, { timestamps: true })

//Middleware

TaskSchema.pre('deleteOne', { document: true, query: false }, async function () {
  
    const taskId = this._id
    if (!taskId) return
    await Note.deleteMany({ task: taskId })
}) 


const Task = mongoose.model<ITask>('Task', TaskSchema)

export default Task
