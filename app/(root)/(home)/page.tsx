
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Home = () => {
  return (
    <>
      <div className=' mx-9 flex w-full flex-col-reverse justify-between gap-2 px-6 sm:flex-row sm:items-center'>
        <h1 className='h1-bold text-dark100_light900 lg:ml-9'>All Questions</h1>
        <Link href='/ask-quesion' className=' flex justify-end max-sm:w-full'>
          <Button className='primary-gradient min-h-[46px] px-4 py-3 !text-light-900'>
            Ask a Question
          </Button>
        </Link>
      </div>
       <div className='ml-16 mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
          <LocalSearchbar
            route='/'
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Search for questions"
            otherClasses="flex-1"

          />
          Filters
      </div> 
    </>
  )
}

export default Home