'use client';

import React, { useEffect } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface IFilters {
  domainId: string,
  topicId: string,
  themeId: string,
  questionTags: string[],
  minWeight: number,
  maxWeight: number,
  searchQuery: string,
}

interface IQuestionFiltersProps {
  onTagFilter: (questionTags: string[]) => void,
  onWeightFilter: (minWeight: number, maxWeight: number) => void,
  onSearchFilter: (searchQuery: string) => void,
  onResetFilters: () => void,
  filters: IFilters,
}

export const QuestionFilters = ({
  onTagFilter,
  onWeightFilter,
  onSearchFilter,
  onResetFilters,
  filters,
}: IQuestionFiltersProps) => {
  const [searchQuery, setSearchQuery] = React.useState(filters.searchQuery);
  const [minWeight, setMinWeight] = React.useState(filters.minWeight.toString());
  const [maxWeight, setMaxWeight] = React.useState(filters.maxWeight.toString());
  const [tagsFilter, setTagsFilter] = React.useState(filters.questionTags.join(', '));

  useEffect(() => {
    setSearchQuery(filters.searchQuery);
    setMinWeight(filters.minWeight.toString());
    setMaxWeight(filters.maxWeight.toString());
    setTagsFilter(filters.questionTags.join(', '));
  }, [filters]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchFilter(value);
  };

  const handleWeightChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    if (type === 'min') {
      setMinWeight(value);
      onWeightFilter(numValue, filters.maxWeight);
    } else {
      setMaxWeight(value);
      onWeightFilter(filters.minWeight, numValue);
    }
  };

  const handleTagsChange = (value: string) => {
    setTagsFilter(value);
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    onTagFilter(tags);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setMinWeight('0');
    setMaxWeight('10');
    setTagsFilter('');
    onResetFilters();
  };

  return (
    <div className='bg-white p-4 rounded-lg shadow-sm border'>
      <h3 className='text-lg font-medium mb-4'>Search & Filters</h3>

      <div className='flex flex-col md:flex-row gap-4'>
        <div className='flex-1'>
          <Input
            placeholder='Search questions by title...'
            value={searchQuery}
            onChange={e => handleSearchChange(e.target.value)}
            className='w-full'
          />
        </div>

        <div className='flex gap-2'>
          <Input
            type='number'
            placeholder='Min weight'
            value={minWeight}
            onChange={e => handleWeightChange('min', e.target.value)}
            className='w-24'
            min='1'
            max='10'
          />
          <Input
            type='number'
            placeholder='Max weight'
            value={maxWeight}
            onChange={e => handleWeightChange('max', e.target.value)}
            className='w-24'
            min='1'
            max='10'
          />
          <Input
            placeholder='Tags (comma separated)'
            value={tagsFilter}
            onChange={e => handleTagsChange(e.target.value)}
            className='w-48'
          />
          <Button variant='outline' onClick={handleClearFilters}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};
