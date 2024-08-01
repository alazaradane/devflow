"use server"

import User from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, ToggleSaveQuestionParams, UpdateUserParams } from "./shared.types"
import { revalidatePath } from "next/cache"
import Question from "@/database/question.model"

export async function getUserById(params:any){
    try {
        connectToDatabase()
        const { userId } = params
        const user = await User.findOne({clerkId:userId })
        return user
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function createUser(userData: CreateUserParams){
    try {
        connectToDatabase()
        const newUser = await User.create(userData)
        return newUser
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function updateUser(params: UpdateUserParams){
    try {
        connectToDatabase()
        const { clerkId, updateData, path} = params
        await User.findOneAndUpdate({clerkId},updateData,{
            new: true,
        })

        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function deleteUser(param: DeleteUserParams){
    try {
        connectToDatabase()
        const {clerkId} = param
        const user = await User.findOneAndDelete({clerkId})

        if(!user){
            throw new Error('User not found')
        }

        // const userQuestionIds = await Question.find({author: user._id}).distinct('_id')

        await Question.deleteMany({author:user._id})

        // TODO: delete user ansers, comments etc
        const deleteUser = await User.findByIdAndDelete(user._id)
        return deleteUser
        
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getAllUsers(params: GetAllUsersParams){
    try {
        connectToDatabase();
        const users = await User.find({}).sort({createdAt:-1})
        return {users}
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams){
    try {
        connectToDatabase()
        const {userId, questionId, path} = params
        const user = await User.findById(userId)
        if(!user){
            throw new Error('User not found!')
        }

        const isQuestionSaved = user.saved.includes(questionId)
        if(isQuestionSaved){
            await User.findByIdAndUpdate(userId,
                {$pull: {saved: questionId}},
                {new : true}
            )
        }else{
            await User.findByIdAndUpdate(userId,
                {$addToSet: {saved: questionId}},
                {new :true}
            )
        }
        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error
    }
}