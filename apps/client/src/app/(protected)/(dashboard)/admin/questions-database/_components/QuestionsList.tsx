'use client';

import React from 'react';

import { QuestionCard } from './QuestionCard';

import { useQuestions } from '@/hooks/use-questions';

export const QuestionsList = () => {
  const { questions, loading } = useQuestions();

  if (loading) {
    return (
      <div className='bg-white p-6 rounded-lg shadow-sm border'>
        <div className='animate-pulse space-y-4'>
          {[1, 2, 3].map(i => (
            <div key={i} className='h-24 bg-gray-200 rounded'></div>
          ))}
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className='bg-white p-6 rounded-lg shadow-sm border text-center'>
        <p className='text-gray-500'>No questions found. Select a domain to view questions.</p>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-sm border'>
      <div className='p-4 border-b'>
        <h3 className='text-lg font-medium'>
          Questions ({questions.length})
        </h3>
      </div>

      <div className='divide-y'>
        {questions.map(question => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
};
