import { Schema, model, models, Document } from "mongoose"; 

export interface Iinteraction extends Document {
    user: Schema.Types.ObjectId;
    action:string;
    question:Schema.Types.ObjectId[]
    answer:Schema.Types.ObjectId[]
    tag:Schema.Types.ObjectId[]
    createdAt: Date
}

const InteractionSchema = new Schema({
    user: {type:Schema.Types.ObjectId, ref: 'User', required: true},
    action: {type:String, required:true},
    question:{type:Schema.Types.ObjectId, ref:'Question'},
    answer: {type:Schema.Types.ObjectId, ref:'Answer'},
    tag:[{type:Schema.Types.ObjectId, ref: 'Tag'}],
    createdAt: {type: Date, default: Date.now}
})

const Interaction = models.Interaction || model('Interaction', InteractionSchema)
export default Interaction