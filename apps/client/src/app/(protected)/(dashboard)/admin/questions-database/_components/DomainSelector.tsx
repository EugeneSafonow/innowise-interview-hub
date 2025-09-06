'use client';

import { useEffect, useState } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuestions } from '@/hooks/use-questions';

interface IDomainSelectorProps {
  onDomainChange: (domainId: string) => void,
  onTopicChange: (topicId: string) => void,
  onThemeChange: (themeId: string) => void,
  selectedDomainId: string,
  selectedTopicId: string,
  selectedThemeId: string,
}

export const DomainSelector = ({
  onDomainChange,
  onTopicChange,
  onThemeChange,
  selectedDomainId,
  selectedTopicId,
  selectedThemeId,
}: IDomainSelectorProps) => {
  const { domains, topics, themes, fetchTopics, fetchThemes } = useQuestions();
  const [selectedDomain, setSelectedDomain] = useState<string>(selectedDomainId || '');
  const [selectedTopic, setSelectedTopic] = useState<string>(selectedTopicId || '');
  const [selectedTheme, setSelectedTheme] = useState<string>(selectedThemeId || '');

  useEffect(() => {
    if (selectedDomainId !== selectedDomain) {
      setSelectedDomain(selectedDomainId || '');
      setSelectedTopic(selectedTopicId || '');
      setSelectedTheme(selectedThemeId || '');
    }
  }, [selectedDomainId, selectedDomain, selectedTopicId, selectedTopic, selectedThemeId, selectedTheme]);

  const handleDomainChange = (domainId: string) => {
    setSelectedDomain(domainId);
    setSelectedTopic('');
    setSelectedTheme('');
    if (domainId) {
      fetchTopics(domainId);
      onDomainChange?.(domainId);
    }
  };

  const handleTopicChange = (topicId: string) => {
    setSelectedTopic(topicId);
    setSelectedTheme('');
    if (topicId) {
      fetchThemes(topicId);
      onTopicChange?.(topicId);
    }
  };

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    onThemeChange?.(themeId);
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
            onValueChange={handleThemeChange}
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
