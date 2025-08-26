'use client';

import React from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const QuestionFilters = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [minWeight, setMinWeight] = React.useState('');
  const [maxWeight, setMaxWeight] = React.useState('');
  const [tagsFilter, setTagsFilter] = React.useState('');

  const handleApplyFilters = () => {
    // TODO: Implement filter logic
    console.log('Applying filters:', { searchQuery, minWeight, maxWeight, tagsFilter });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setMinWeight('');
    setMaxWeight('');
    setTagsFilter('');
  };

  return (
    <div className='bg-white p-4 rounded-lg shadow-sm border'>
      <h3 className='text-lg font-medium mb-4'>Search & Filters</h3>

      <div className='flex flex-col md:flex-row gap-4'>
        <div className='flex-1'>
          <Input
            placeholder='Search questions by title...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='w-full'
          />
        </div>

        <div className='flex gap-2'>
          <Input
            type='number'
            placeholder='Min weight'
            value={minWeight}
            onChange={e => setMinWeight(e.target.value)}
            className='w-24'
            min='1'
            max='10'
          />
          <Input
            type='number'
            placeholder='Max weight'
            value={maxWeight}
            onChange={e => setMaxWeight(e.target.value)}
            className='w-24'
            min='1'
            max='10'
          />
          <Input
            placeholder='Tags (comma separated)'
            value={tagsFilter}
            onChange={e => setTagsFilter(e.target.value)}
            className='w-48'
          />
          <Button variant='outline' onClick={handleApplyFilters}>
            Apply Filters
          </Button>
          <Button variant='ghost' onClick={handleClearFilters}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};
