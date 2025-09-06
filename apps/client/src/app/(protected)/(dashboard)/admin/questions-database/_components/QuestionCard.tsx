'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { IQuestion } from '@/types/questions';

interface IQuestionCardProps {
  question: IQuestion,
}

export const QuestionCard = ({ question }: IQuestionCardProps) => (
  <div className='p-4 hover:bg-gray-50 transition-colors'>
    <div className='flex justify-between items-start'>
      <div className='flex-1'>
        <h4 className='font-medium text-lg mb-2'>{question.title}</h4>

        <div className='flex items-center gap-4 text-sm text-gray-600 mb-3'>
          <span>Weight: {question.weight}/10</span>
          <span>Tags: {question.tags.join(', ') || 'No tags'}</span>
          <span>Follow-ups: {question.followUpQuestions.length}</span>
        </div>

        <div className='text-sm text-gray-500'>
          Domain: {question.domainId} → Topic: {question.topicId} → Theme: {question.themeId}
        </div>
      </div>

      <div className='flex gap-2 ml-4'>
        <Button size='sm' variant='outline'>
          Edit
        </Button>
        <Button size='sm' variant='outline'>
          View
        </Button>
        <Button size='sm' variant='destructive'>
          Delete
        </Button>
      </div>
    </div>
  </div>
);
