import Question from '@/components/forms/Question'
import { getUserById } from '@/lib/actions/user.action'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import React from 'react'

const page = async () => {

  const {userId} = auth()
  if(!userId) return redirect('/sign-in')
  
  const mongoUser = await getUserById({userId})

  return (
    <div className=' xl:flex-start flex flex-col'>
      <h1 className=' h1-bold text-dark100_light900'>Ask a Question</h1>
      <div className=' mt-6'>
        <Question mongoUserId = {JSON.stringify(mongoUser?._id)}/>
      </div>
    </div>
  )
}

export default page