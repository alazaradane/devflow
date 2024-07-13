/* eslint-disable no-unused-vars */
"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";

export async function createQuestion(params: any) {
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
            {$setOnInsert: {name: tag}, $push: {question: question._id}},
            {upsert: true, new:true}
        )
        tagsDocuments.push(existingTag._id)
       }

       await Question.findByIdAndUpdate(question._id, {
        $push: {tags: {$each: tagsDocuments}}
       })

    } catch (error) {
        console.error('Error creating question:', error);
    }
}
