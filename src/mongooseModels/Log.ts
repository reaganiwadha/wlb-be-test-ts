import { Schema, model, Document } from 'mongoose'

interface ILog extends Document{
    path : string,
    request : string,
    response : string,
    timestamp : Date,
    responseTime : Number
}

const LogSchema = new Schema({
    path : String,
    request : String,
    response : String,
    timestamp : Date,
    responseTime : Number
})

export default model<ILog>('Log', LogSchema)

