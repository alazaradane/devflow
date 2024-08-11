/* eslint-disable no-unused-vars */
"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import { CreateQuestionParams, DeleteQuestionParams, GetQuestionByIdParams, GetQuestionsParams, GetUserStatsParams, QuestionVoteParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";

export async function getQuestions(params:GetQuestionsParams){
    try {
        connectToDatabase();
        const questions = await Question.find({})
            .populate({path:'tags', model:Tag})
            .populate({path:'author', model:User})
            .sort({createdAt:-1})
        return {questions}
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function createQuestion(params: CreateQuestionParams) {
    try {
       await connectToDatabase();
       const {title, content, tags, author, path} = params;

       // Create Question
       const question = await Question.create({
        title,
        content,
        author
       })

       const tagsDocuments = [];

       // Create a tag or get if it already exist
       for(const tag of tags){
        const existingTag = await Tag.findOneAndUpdate(
            {name: {$regex: new RegExp(`^${tag}$`, "i")}},
            {$setOnInsert: {name: tag}, $push: {questions: question._id}},
            {upsert: true, new:true}
        )
        tagsDocuments.push(existingTag._id)
       }

       await Question.findByIdAndUpdate(question._id, {
        $push: {tags: {$each: tagsDocuments}}
       })

       revalidatePath(path)

    } catch (error) {
        console.error('Error creating question:', error);
    }
}

export async function getQuestionById(params: GetQuestionByIdParams){
    try {
        connectToDatabase()
        const {questionId} = params
        const question = Question.findById(questionId)
            .populate({path:'tags', model:Tag, select:'_id name'})
            .populate({path:'author', model:User, select:'_id clerkId name picture'})
        
        return question
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function upvoteQuestion(params: QuestionVoteParams){
    try {
        connectToDatabase();
        const {questionId, userId, hasupVoted, hasdownVoted, path} = params

        let updateQurey = {}

        if(hasupVoted){
            updateQurey = {$pull: {upvotes: userId}}
        }else if(hasdownVoted){
            updateQurey = {
                $pull: {downvotes: userId},
                $push : {upvotes: userId}
            }
        }else {
            updateQurey= { $addToSet:{upvotes: userId}}
        }
        const question = await Question.findByIdAndUpdate(questionId, updateQurey, {new:true})

        if(!question){
            console.log('Question not found')
        }
        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error
    }
}
export async function downvoteQuestion(params: QuestionVoteParams){
    try {
        connectToDatabase();
        const {questionId, userId, hasupVoted, hasdownVoted, path} = params

        let updateQurey = {}

        if(hasdownVoted){
            updateQurey = {$pull: {downvotes: userId}}
        }else if(hasupVoted){
            updateQurey = {
                $pull: {upvotes: userId},
                $push : {downvotes: userId}
            }
        }else {
            updateQurey= { $addToSet:{downvotes: userId}}
        }
        const question = await Question.findByIdAndUpdate(questionId, updateQurey, {new:true})

        if(!question){
            console.log('Question not found')
        }
        revalidatePath(path)

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getUserQuestions(params: GetUserStatsParams){
    try {
        connectToDatabase()
        const {userId, page=1, pageSize=10} = params

        const totalQuestions = await Question.countDocuments({author: userId})
        const userQuestions = await Question.find({author:userId})
            .sort({views:-1, upvotes:-1})
            .populate('tags', '_id name')
            .populate('author', '_id clerkId name picture')

        return { totalQuestions, questions: userQuestions}

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function deleteQuestions(params: DeleteQuestionParams){
    try {
        connectToDatabase()

        const {questionId, path} = params

        await Question.deleteOne({_id:questionId})
        await Answer.deleteMany({question:questionId})
        await Interaction.deleteMany({question:questionId})
        await Tag.updateMany({questions:questionId}, {$pull: {questions:questionId}})
        
        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error
    }
}