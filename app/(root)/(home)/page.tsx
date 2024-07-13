/* eslint-disable tailwindcss/no-unnecessary-arbitrary-value */

import HomeFilters from "@/components/home/HomeFilters";
import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";
import React from "react";
import { getQuestions } from "@/lib/actions/question.action";


const Home = async () => {

  const result = await getQuestions({})
  
  return (
    <>
      <div className=" mx-9 flex w-full flex-col-reverse justify-between gap-2 px-6 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900 max-lg:ml-5 lg:ml-[12rem]">
          All Questions
        </h1>
        <Link href="/ask-quesion" className=" flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className=" mt-11 flex justify-between gap-5 max-lg:ml-[14rem] max-lg:w-[35rem] max-sm:flex-col sm:items-center lg:ml-[16rem] lg:w-[40rem] xl:relative xl:right-[3rem] xl:w-[35rem] ">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses=" min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilters />

      <div className=" mt-10 flex w-full flex-col items-center justify-center gap-6 ">
        {result.questions.length > 0 ? (
          result.questions.map((question) => (
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
            title="There's no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. 
                  our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default Home;
