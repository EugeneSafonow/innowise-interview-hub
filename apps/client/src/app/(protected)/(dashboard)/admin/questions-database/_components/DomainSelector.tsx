'use client';

import React from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuestions } from '@/hooks/use-questions';

export const DomainSelector = () => {
  const { domains, topics, themes, fetchTopics, fetchThemes } = useQuestions();
  const [selectedDomain, setSelectedDomain] = React.useState<string>('');
  const [selectedTopic, setSelectedTopic] = React.useState<string>('');
  const [selectedTheme, setSelectedTheme] = React.useState<string>('');

  const handleDomainChange = (domainId: string) => {
    setSelectedDomain(domainId);
    setSelectedTopic('');
    setSelectedTheme('');
    if (domainId) {
      fetchTopics(domainId);
    }
  };

  const handleTopicChange = (topicId: string) => {
    setSelectedTopic(topicId);
    setSelectedTheme('');
    if (topicId) {
      fetchThemes(topicId);
    }
  };

  return (
    <div className='bg-white p-4 rounded-lg shadow-sm border'>
      <h3 className='text-lg font-medium mb-4'>Select Domain & Topic</h3>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Domain Select */}
        <div>
          <label className='block text-sm font-medium mb-2'>Domain</label>
          <Select value={selectedDomain} onValueChange={handleDomainChange}>
            <SelectTrigger>
              <SelectValue placeholder='Choose domain' />
            </SelectTrigger>
            <SelectContent>
              {domains.map(domain => (
                <SelectItem key={domain.id} value={domain.id}>
                  {domain.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Topic Select */}
        <div>
          <label className='block text-sm font-medium mb-2'>Topic</label>
          <Select
            value={selectedTopic}
            onValueChange={handleTopicChange}
            disabled={!selectedDomain}
          >
            <SelectTrigger>
              <SelectValue placeholder='Choose topic' />
            </SelectTrigger>
            <SelectContent>
              {topics.map(topic => (
                <SelectItem key={topic.id} value={topic.id}>
                  {topic.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Theme Select */}
        <div>
          <label className='block text-sm font-medium mb-2'>Theme</label>
          <Select
            value={selectedTheme}
            onValueChange={setSelectedTheme}
            disabled={!selectedTopic}
          >
            <SelectTrigger>
              <SelectValue placeholder='Choose theme' />
            </SelectTrigger>
            <SelectContent>
              {themes.map(theme => (
                <SelectItem key={theme.id} value={theme.id}>
                  {theme.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
