import { useSelector } from 'react-redux';

import { useAppDispatch } from './use-dispatch';

import {
  getQuestions, getDomains, getTopics, getThemes,
  getFormData, getQuestionsIsLoading, getQuestionsError,
} from '@/providers/store/selectors/questions';
import {
  setQuestions, setDomains, setTopics, setThemes,
  setFormData, clearFormData, setLoading, setError,
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

  const fetchDomains = async () => {
    try {
      dispatch(setLoading(true));
      const response = await questionsApi.getDomains();
      dispatch(setDomains(response.data));
    } catch (err: any) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchTopics = async (domainId: string) => {
    try {
      const response = await questionsApi.getTopics(domainId);
      dispatch(setTopics(response.data));
    } catch (err: any) {
      dispatch(setError(err.message));
    }
  };

  const fetchThemes = async (topicId: string) => {
    try {
      const response = await questionsApi.getThemes(topicId);
      dispatch(setThemes(response.data));
    } catch (err: any) {
      dispatch(setError(err.message));
    }
  };

  const createQuestion = async (data: ICreateQuestionDto) => {
    try {
      dispatch(setLoading(true));
      const response = await questionsApi.createQuestion(data);
      dispatch(setQuestions([...questions, response.data]));
      dispatch(clearFormData());
      return response.data;
    } catch (err: any) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

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
    clearFormData: () => dispatch(clearFormData()),
    clearError: () => dispatch(setError(null)),
  };
};
