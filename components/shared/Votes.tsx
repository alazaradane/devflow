"use client"
import { formatandDivideNumber } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'

interface Props {
  type:string;
  itemId:string;
  userId:string;
  upvotes: number;
  hasupVoted:boolean;
  downvotes:number;
  hasdownVoted:boolean;
  hasSaved?:boolean
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasupVoted,
  downvotes,
  hasdownVoted,
  hasSaved
}:Props) => {

  const handleSave = ()=>{
    
  }

  const handleVote = (action:string)=>{

  }

  return (
    <div className=' flex gap-5'>
        <div className='flex-center gap-2.5'>
          <div className='flex-center gap-1.5'>
            <Image
              src={hasupVoted ? '/assets/icons/upvoted.svg' : '/assets/icons/upvote.svg'}
              width={18}
              height={18}
              alt='upvotes'
              className='cursor-pointer'
              onClick={()=> handleVote('downvote')}
            />
          </div>
          <div className='flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1'>
            <p className=' subtle-medium text-dark400_light900'>{formatandDivideNumber(upvotes)}</p>
          </div>
        </div>
        <div className='flex-center gap-2.5'>
          <div className='flex-center gap-1.5'>
            <Image
              src={hasdownVoted ? '/assets/icons/downvoted.svg' : '/assets/icons/downvote.svg'}
              width={18}
              height={18}
              alt='downvote'
              className='cursor-pointer'
              onClick={()=>handleVote('downvote')}
            />
          </div>
          <div className='flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1'>
            <p className=' subtle-medium text-dark400_light900'>{formatandDivideNumber(upvotes)}</p>
          </div>
        </div>
          <Image
              src={hasSaved ? '/assets/icons/star-filled.svg' : '/assets/icons/star-red.svg'}
              width={18}
              height={18}
              alt='saved'
              className='cursor-pointer'
              onClick={handleSave}
            />
    </div>
  )
}

export default Votes