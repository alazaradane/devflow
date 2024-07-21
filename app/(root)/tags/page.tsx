import Filter from '@/components/shared/Filter'
import NoResult from '@/components/shared/NoResult'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'

import { UserFilters } from '@/constants/filters'
import { getAllTags } from '@/lib/actions/tag.action'
import Link from 'next/link'

import React from 'react'

const Page = async() => {

    const result = await getAllTags({})
  return (
    <>
        <div className=" mx-9 flex w-full flex-col-reverse justify-between gap-2 px-6 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900 max-lg:ml-5 lg:ml-48">
          All Tags
        </h1>
      </div>
      <div className=" mt-11 flex justify-between gap-5 max-lg:ml-56 max-lg:w-[35rem] max-sm:flex-col sm:items-center lg:ml-64 lg:w-[40rem] xl:relative xl:right-12 xl:w-[35rem] ">
        <LocalSearchbar
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for "
          otherClasses="flex-1"
        />
        <Filter
          filters={UserFilters}
          otherClasses=" min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <section className=' mt-12 flex flex-wrap gap-4'>
        {result.tags.length > 0 ? (
            result.tags.map((tag)=>(
                <Link href={`/tags/${tag._id}`} key={tag._id} className='shadow-light100_darknone'>
                    <article className='background-light900_dark200 light-border sw:w-[260px] flex w-full flex-col rounded-2xl border px-8 py-10'>
                        <div className='background-light800_dark400 w-fit rounded-sm px-5 py-1.5'>
                            <p className=' paragraph-semibold text-dark300_light900'>{tag.name}</p>
                        </div>
                        <p className='small-medium text-dark400_light500 mt-3.5'>
                            <span className='body-semibold primary-text-gradient mr-2.5'>{tag.questions.length}+ </span>Questions
                        </p>
                    </article>
                </Link>
            ))
        ):(
            <NoResult
                title="No tags found"
                description='It look like there are no tags found'
                link='/ask-question'
                linkTitle='Ask a Question'
            />
        )}
      </section>
    </>
  )
}

export default Page