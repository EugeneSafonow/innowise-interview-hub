import { useSelector } from 'react-redux';
import { useCallback } from 'react';

import { useAppDispatch } from './use-dispatch';

import {
  getQuestions, getDomains, getTopics, getThemes,
  getFormData, getQuestionsIsLoading, getQuestionsError,
} from '@/providers/store/selectors/questions';
import {
  setQuestions, setDomains, setTopics, setThemes,
  clearFormData, setLoading, setError,
} from '@/providers/store/slices/questionsSlice';
import { questionsApi } from '@/api/questions';
import { ICreateQuestionDto } from '@/types/questions';

export const useQuestions = () => {
  const dispatch = useAppDispatch();

  const questions = useSelector(getQuestions);
  const domains = useSelector(getDomains);
  const topics = useSelector(getTopics);
  const themes = useSelector(getThemes);
  const formData = useSelector(getFormData);
  const loading = useSelector(getQuestionsIsLoading);
  const error = useSelector(getQuestionsError);

  const fetchDomains = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await questionsApi.getDomains();
      dispatch(setDomains(response.data));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const fetchTopics = useCallback(async (domainId: string) => {
    try {
      const response = await questionsApi.getTopics(domainId);
      dispatch(setTopics(response.data));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      dispatch(setError(errorMessage));
    }
  }, [dispatch]);

  const fetchThemes = useCallback(async (topicId: string) => {
    try {
      const response = await questionsApi.getThemes(topicId);
      dispatch(setThemes(response.data));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      dispatch(setError(errorMessage));
    }
  }, [dispatch]);

  const createQuestion = useCallback(async (data: ICreateQuestionDto) => {
    try {
      dispatch(setLoading(true));
      const response = await questionsApi.createQuestion(data);
      dispatch(setQuestions([...questions, response.data]));
      dispatch(clearFormData());
      return response.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      dispatch(setError(errorMessage));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, questions]);

  const clearFormDataHandler = useCallback(() => {
    dispatch(clearFormData());
  }, [dispatch]);

  const clearErrorHandler = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  return {
    questions,
    domains,
    topics,
    themes,
    formData,
    loading,
    error,

    fetchDomains,
    fetchTopics,
    fetchThemes,
    createQuestion,
    clearFormData: clearFormDataHandler,
    clearError: clearErrorHandler,
  };
};
