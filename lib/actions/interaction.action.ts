"use server"

import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";

export async function viewQuestion(params: ViewQuestionParams){
    try {
        await connectToDatabase();
        
    } catch (error) {
        console.log(error)
        throw error
    }
}