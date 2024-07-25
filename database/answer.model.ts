import {Schema, models, model, Document} from 'mongoose'


export interface IAnswer extends Document{
    author:Schema.Types.ObjectId;
    question:Schema.Types.ObjectId;
    content: string;
    upVote: Schema.Types.ObjectId[]
    downVote: Schema.Types.ObjectId[]
    createdAt: Date;
}

const AnswerSchema = new Schema({
    author:{type:Schema.Types.ObjectId, ref:'User', required:true},
    question: {type:Schema.Types.ObjectId, ref:'Question', required:true},
    content: {type:String, required:true},
    upVote: [{type:Schema.Types.ObjectId, ref:'User'}],
    downVote:[{type:Schema.Types.ObjectId, ref:'User'}],
    createdAt: {type: Date, default: Date.now}
})

const Answer = models.Answer || model('Answer', AnswerSchema)
export default Answer
