import mongoose, { Schema, Types } from 'mongoose'
import Task, { ITask } from './Task'
import { IUser } from './User'
import Note from './Note'



export interface IProject {  
    projectName: string                                  
    clientName: string
    description: string
    tasks:  (Types.ObjectId | ITask)[],  
    manager: (Types.ObjectId | IUser), 
    team: (Types.ObjectId | IUser)[],
}

const ProjectSchema: Schema = new Schema<IProject> ({  
    projectName: {
        type: String,
        required: true,  
        trim: true
    },
    clientName: {
        type: String,
        required: true,  
    },
    description: {
        type: String,
        required: true,  
        trim: true
    },
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }],
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    team: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
}, {timestamps: true})

ProjectSchema.pre('deleteOne', { document: true, query: false }, async function () {

    const projectId = this._id
    if (!projectId) return

    const tasks = await Task.find({project: projectId})

    for (const task of tasks){
        await Note.deleteMany({task: task._id})
    }
    await Task.deleteMany({ project: projectId })
})

const Project = mongoose.model<IProject>('Project', ProjectSchema)

export default Project


