'use client';

import { useEffect, useCallback, useState } from 'react';

import { DomainSelector, QuestionFilters } from './_components';
import { IFilters } from './_components/QuestionFilters';

import { Canvas } from '@/components/canvas';
import { ISetInterview } from '@/components/canvas/types/types';
import { useQuestions } from '@/hooks/use-questions';
import { INestedDomain } from '@/types/questions';

const QuestionsDatabasePage = () => {
  const {
    fetchDomains,
    fetchStructure,
    loading,
    error,
  } = useQuestions();

  const [filters, setFilters] = useState<IFilters>({
    domainId: '',
    topicId: '',
    themeId: '',
    questionTags: [],
    minWeight: 0,
    maxWeight: 10,
    searchQuery: '',
  });

  const [structureData, setStructureData] = useState<ISetInterview[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  const updateFilters = useCallback((newFilters: Partial<IFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      domainId: '',
      topicId: '',
      themeId: '',
      questionTags: [],
      minWeight: 0,
      maxWeight: 10,
      searchQuery: '',
    });
  }, []);

  const loadStructureWithFilters = useCallback(async (currentFilters: IFilters) => {
    if (!currentFilters.domainId) {
      setStructureData([]);
      return;
    }

    setIsFiltering(true);
    try {
      const data: INestedDomain = await fetchStructure(currentFilters.domainId);

      const filteredData: INestedDomain = { ...data };

      if (currentFilters.topicId) {
        filteredData.topics = filteredData.topics?.filter(topic =>
          topic.id === currentFilters.topicId
        ) || [];
      }

      if (currentFilters.themeId) {
        filteredData.topics = filteredData.topics?.map(topic => ({
          ...topic,
          themes: topic.themes?.filter(theme =>
            theme.id === currentFilters.themeId
          ) || [],
        })) || [];
      }

      if (currentFilters.questionTags.length > 0) {
        filteredData.topics = filteredData.topics?.map(topic => ({
          ...topic,
          themes: topic.themes?.map(theme => ({
            ...theme,
            questions: theme.questions?.filter(question =>
              question.tags?.some(tag => currentFilters.questionTags.includes(tag))
            ) || [],
          })) || [],
        })) || [];
      }

      filteredData.topics = filteredData.topics?.map(topic => ({
        ...topic,
        themes: topic.themes?.map(theme => ({
          ...theme,
          questions: theme.questions?.filter(question =>
            question.weight >= currentFilters.minWeight
            && question.weight <= currentFilters.maxWeight
          ) || [],
        })) || [],
      })) || [];

      if (currentFilters.searchQuery) {
        const searchLower = currentFilters.searchQuery.toLowerCase();
        filteredData.topics = filteredData.topics?.map(topic => ({
          ...topic,
          themes: topic.themes?.map(theme => ({
            ...theme,
            questions: theme.questions?.filter(question =>
              question.title.toLowerCase().includes(searchLower)
            ) || [],
          })) || [],
        })) || [];
      }

      const transformed = [{
        id: filteredData.id,
        title: filteredData.title,
        topics: filteredData.topics || [],
      }];

      setStructureData(transformed);
    } catch (error) {
      console.error('Error fetching filtered structure:', error);
    } finally {
      setIsFiltering(false);
    }
  }, [fetchStructure]);

  useEffect(() => {
    loadStructureWithFilters(filters);
  }, [filters, loadStructureWithFilters]);

  const handleDomainChange = useCallback((domainId: string) => {
    updateFilters({ domainId, topicId: '', themeId: '' });
  }, [updateFilters]);

  const handleTopicChange = useCallback((topicId: string) => {
    updateFilters({ topicId, themeId: '' });
  }, [updateFilters]);

  const handleThemeChange = useCallback((themeId: string) => {
    updateFilters({ themeId });
  }, [updateFilters]);

  const handleTagFilter = useCallback((questionTags: string[]) => {
    updateFilters({ questionTags });
  }, [updateFilters]);

  const handleWeightFilter = useCallback((minWeight: number, maxWeight: number) => {
    updateFilters({ minWeight, maxWeight });
  }, [updateFilters]);

  const handleSearchFilter = useCallback((searchQuery: string) => {
    updateFilters({ searchQuery });
  }, [updateFilters]);

  if (loading || isFiltering) {
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

      <DomainSelector
        onDomainChange={handleDomainChange}
        onTopicChange={handleTopicChange}
        onThemeChange={handleThemeChange}
        selectedDomainId={filters.domainId}
        selectedTopicId={filters.topicId}
        selectedThemeId={filters.themeId}
      />

      <QuestionFilters
        onTagFilter={handleTagFilter}
        onWeightFilter={handleWeightFilter}
        onSearchFilter={handleSearchFilter}
        onResetFilters={resetFilters}
        filters={filters}
      />

      {structureData.length > 0 && (
        <div className='border rounded-lg p-4 mb-20'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-lg font-semibold'>Questions Tree Structure</h2>
            <div className='text-sm text-gray-600'>
              {filters.domainId && `Domain: ${filters.domainId}`}
              {filters.topicId && ` | Topic: ${filters.topicId}`}
              {filters.themeId && ` | Theme: ${filters.themeId}`}
              {filters.questionTags.length > 0 && ` | Tags: ${filters.questionTags.join(', ')}`}
            </div>
          </div>
          <div className='w-full h-[600px] border rounded bg-gray-100'>
            <Canvas nodes={structureData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsDatabasePage;
