import UserCard from '@/components/cards/UserCard'
import Filter from '@/components/shared/Filter'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'

import { UserFilters } from '@/constants/filters'
import { getAllUsers } from '@/lib/actions/user.action'
import Link from 'next/link'

import React from 'react'

const Page = async() => {

    const result = await getAllUsers({})
  return (
    <>
        <div className=" mx-9 flex w-full flex-col-reverse justify-between gap-2 px-6 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900 max-lg:ml-5 lg:ml-48">
          All Users
        </h1>
      </div>
      <div className=" mt-11 flex justify-between gap-5 max-lg:ml-56 max-lg:w-[35rem] max-sm:flex-col sm:items-center lg:ml-64 lg:w-[40rem] xl:relative xl:right-12 xl:w-[35rem] ">
        <LocalSearchbar
          route="/community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for amazing minds"
          otherClasses="flex-1"
        />
        <Filter
          filters={UserFilters}
          otherClasses=" min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <section className=' mt-12 flex flex-wrap gap-4'>
        {result.users.length > 0 ? (
            result.users.map((user)=>(
                <UserCard key={user._id} user={user}/>
            ))
        ):(
            <div className=' paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center'>
                <p>User not found</p>
                <Link href='/sign-up' className='mt-2 font-bold text-accent-blue'>Join to be the first</Link>
            </div>
        )}
      </section>
    </>
  )
}

export default Page