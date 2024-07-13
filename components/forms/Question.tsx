/* eslint-disable no-unused-vars */
/* eslint-disable no-return-assign */
"use client"
import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { QuestionsSchema } from "@/lib/validations"
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { createQuestion } from '@/lib/actions/question.action';
import {useRouter, usePathname} from 'next/navigation'

const type:any = 'create'

interface Props{
  mongoUserId:string
}

const Question = ({mongoUserId}:Props) => {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const editorRef = useRef(null);
  const router = useRouter()
  const pathname = usePathname()

  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: "",
      explanation: "",
      tags: []
    },
  });

  
  async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    setIsSubmitting(true)
    try {
      await createQuestion({
        title: values.title,
        content: values.explanation,
        tags: values.tags,
        author: JSON.parse(mongoUserId)
      })
      router.push('/')
    } catch (error) {
        console.error('Error submitting question:', error);
    } finally{
      setIsSubmitting(false)
    }
  }

  
  const handleInputkeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field:any)=>{
      if(e.key==='Enter' && field.name ==='tags'){
        e.preventDefault();

        const tagInput = e.target as HTMLInputElement
        const tagValue = tagInput.value.trim()

        if(tagValue !== ''){
          if(tagValue.length > 15){
            return form.setError('tags', {
              type : 'required',
              message: 'Tag must be less than 15 characters'
            })
          }

          if(!field.value.includes(tagValue as never)){
            form.setValue('tags', [...field.value, tagValue])
            tagInput.value =''
            form.clearErrors('tags')
          }else{
            form.trigger()
          }
        }
      }
  }

  const handleRemoveTag = (tag:string, field:any)=>{
    const newTags = field.value.filter((t:string)=> t !== tag)
    form.setValue('tags', newTags)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="-ml-12 flex w-full flex-col gap-10 max-sm:ml-2  ">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className=" flex w-full flex-col ">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className=" mt-3.5">
                <Input
                  className=" no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] w-[38rem] border max-sm:w-[25rem]"
                  placeholder="shadcn" {...field}
                />
              </FormControl>
              <FormDescription className=" body-regular mt-2.5 text-light-500">
                Be specific and imagine you&apos;re asking a question to another person
              </FormDescription>
              <FormMessage className=" text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className=" flex w-full flex-col gap-3 ">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className=" mt-3.5 w-[38rem]">
                <Editor 
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(_evt, editor) => {
                    // @ts-ignore
                    editorRef.current = editor}}
                  onBlur={field.onBlur}
                  onEditorChange={(content)=>field.onChange(content)}
                  initialValue=''
                  init={{
                    height: 350,
                    width:550,
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'codesample', 'fullscreen',
                      'insertdatetime', 'media', 'table', 
                    ],
                    toolbar: 'undo redo  | ' +
                      'codesample | bold italic forecolor | alignleft aligncenter | ' +
                      'alignright alignjustify | bullist numlist  | ' +
                      'removeformat | help',
                    content_style: 'body { font-family:Inter font-size:16px }'
                  }}
                />
              </FormControl>
              <FormDescription className=" body-regular mt-2.5 text-light-500 max-sm:w-[28rem]">
                Introduce the problem expand what you put on the title. Minimum 20 characters 
              </FormDescription>
              <FormMessage className=" text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className=" flex w-full flex-col ">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className=" mt-3.5">
                <>
                  <Input
                    className=" no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border max-sm:w-[25rem]"
                    placeholder="Add tags"
                    onKeyDown={(e)=>handleInputkeyDown(e, field)}
                  />
                  {
                    field.value.length > 0 && (
                      <div className=' flex-start mt-2.5 gap-2.5'>
                        {field.value.map((tag)=>(
                          <Badge key={tag} 
                            className='subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-sm border-none px-4 py-2 capitalize'
                            onClick={()=>handleRemoveTag(tag, field)}
                          >
                            {tag}
                            <Image 
                              src='/assets/icons/close.svg'
                              alt='Close icon'
                              width={12}
                              height={12}
                              className=' cursor-pointer object-contain invert-0 dark:invert'
                            />
                          </Badge>
                        ))}
                      </div>
                    )
                  }
                </>
              </FormControl>
              <FormDescription className=" body-regular mt-2.5 text-light-500 max-sm:w-[28rem]">
                Add up to 3 tags to describe what your question is about. You need to press enter to add a tag
              </FormDescription>
              <FormMessage className=" text-red-500" />
            </FormItem>
          )}
        />
        <Button type="submit" className=' primary-gradient w-fit !text-light-900' disabled={isSubmitting}>
          {isSubmitting ? (
              <>
                {type === 'edit' ? 'Editing...' : 'Posting...'}
              </>
            ):(
              <> 
               {type ==='edit' ? 'Editing Question': 'Ask a Question'}
              </>
            )
          }
        </Button>
      </form>
    </Form>
  );
}

export default Question;
