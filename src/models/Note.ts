
import mongoose, { Schema, Types } from 'mongoose'

export interface INote {
    content: string
    createdBy: Types.ObjectId
    task: Types.ObjectId

}

const NoteSchema: Schema = new Schema({
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    task: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Task'
    }

}, {timestamps: true})

const Note = mongoose.model<INote>('Note', NoteSchema)
export default Note