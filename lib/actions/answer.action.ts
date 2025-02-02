"use server"

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { AnswerVoteParams, CreateAnswerParams, DeleteAnswerParams, GetAnswersParams } from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import Interaction from "@/database/interaction.model";

export async function createAnswer(params: CreateAnswerParams){
    try {
        connectToDatabase();
        const {content, author, question,path} = params
        const newAnswer = await Answer.create({content, author, question})

        await Question.findByIdAndUpdate(question, {
            $push: {answers: newAnswer._id}
        })
        revalidatePath(path)
        
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getAnswer(params: GetAnswersParams ){
    try {
        connectToDatabase();
        const {questionId} = params;
        const answers = await Answer.find({question:questionId})
            .populate("author", "_id clerkId name picture")
            .sort({createdAt:-1})

        return {answers} 
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
    try {
         connectToDatabase();
        const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

        let updateQuery = {};
        if (hasupVoted) {
            updateQuery = { $pull: { upVote: userId } };
        } else if (hasdownVoted) {
            updateQuery = {
                $pull: { downVote: userId },
                $push: { upVote: userId }
            };
        } else {
            updateQuery = { $addToSet: { upVote: userId } };
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true });
        if (!answer) {
            throw new Error('Answer not found');
        }

        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
    try {
        connectToDatabase();
        const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

        let updateQuery = {};
        if (hasdownVoted) {
            updateQuery = { $pull: { downVote: userId } };
        } else if (hasupVoted) {
            updateQuery = {
                $pull: { upVote: userId },
                $push: { downVote: userId }
            };
        } else {
            updateQuery = { $addToSet: { downVote: userId } };
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true });
        if (!answer) {
            throw new Error('Answer not found!');
        }

        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export async function deleteAnswer(params: DeleteAnswerParams){
    try {
        connectToDatabase();
        const {answerId, path} = params

        const answer = await Answer.findById(answerId)

        if(!answer){
            throw new Error('Answer not found!')
        }
        await Answer.deleteOne({_id:answerId})
        await Question.updateMany({_id:answer.question},{$pull:{answers: answerId}})
        await Interaction.deleteMany({answer:answerId})

        revalidatePath(path)
        
    } catch (error) {
        console.log(error)
        throw error
    }
}