/* eslint-disable tailwindcss/no-unnecessary-arbitrary-value */

import HomeFilters from "@/components/home/HomeFilters";
import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import React from "react";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";


const Home = async () => {
  
  const {userId} = auth()

  if(!userId) return null

  const result = await getSavedQuestions({
    clerkId: userId
  })
  
  return (
    <>
        <h1 className="h1-bold text-dark100_light900 max-sm:mr-[10rem] lg:ml-[12rem]">
          Saved Questions
        </h1>


<div className="mt-11 flex w-[25rem] flex-col justify-between gap-5 sm:w-[35rem] sm:flex-row sm:items-center lg:ml-[16rem] xl:relative xl:right-[3rem]">
  <LocalSearchbar
    route="/"
    iconPosition="left"
    imgSrc="/assets/icons/search.svg"
    placeholder="Search for questions"
    otherClasses="flex-1"
  />
  <Filter
    filters={QuestionFilters}
    otherClasses="min-h-[56px] sm:min-w-[170px] sm:block"
  />
</div>

<HomeFilters />

<div className="ml-[10rem] mt-10 flex flex-col items-center justify-center gap-6 px-4 sm:px-0">
  {result.questions.length > 0 ? (
    result.questions.map((question:any) => (
      <QuestionCard
        key={question._id}
        _id={question._id}
        title={question.title}
        tags={question.tags}
        author={question.author}
        upvotes={question.upvotes}
        views={question.views}
        answers={question.answers}
        createdAt={question.createdAt}
      />
    ))
  ) : (
    <NoResult
      title="There's no saved question to show"
      description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. 
                  Your query could be the next big thing others learn from. Get involved! 💡"
      link="/ask-question"
      linkTitle="Ask a Question"
    />
  )}
</div>

    </>
  );
};

export default Home;
