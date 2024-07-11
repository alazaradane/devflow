import Question from '@/components/forms/Question'
import React from 'react'

const page = () => {
  return (
    <div className=' xl:flex-start flex flex-col'>
      <h1 className=' h1-bold text-dark100_light900'>Ask a Question</h1>
      <div className=' mt-6'>
        <Question/>
      </div>
    </div>
  )
}

export default page