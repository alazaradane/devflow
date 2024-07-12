"use server";

import { connectToDatabase } from "../mongoose";

export async function createQuestion(params: any) {
    try {
       await connectToDatabase();
       // Add your logic to create a question here.
    } catch (error) {
        console.error('Error creating question:', error);
    }
}
