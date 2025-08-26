'use client';

import React, { useEffect } from 'react';

import { DomainSelector, QuestionFilters, QuestionsList } from './_components';

import { useQuestions } from '@/hooks/use-questions';

const QuestionsDatabasePage = () => {
  const { fetchDomains, loading, error } = useQuestions();

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  if (loading) {
    return (
      <div className='p-6'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-gray-200 rounded w-1/3'></div>
          <div className='h-32 bg-gray-200 rounded'></div>
          <div className='h-64 bg-gray-200 rounded'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-6'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-800'>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Questions Database</h1>
        <div className='flex gap-2'>
          <button className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'>
            Add Question
          </button>
          <button className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'>
            Import/Export
          </button>
        </div>
      </div>

      <DomainSelector />
      <QuestionFilters />
      <QuestionsList />
    </div>
  );
};

export default QuestionsDatabasePage;
