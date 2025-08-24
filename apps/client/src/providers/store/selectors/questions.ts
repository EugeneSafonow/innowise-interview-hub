import { TStateModel } from '..';

export const getQuestions = (state: TStateModel) => state?.questions.questions;
export const getDomains = (state: TStateModel) => state?.questions.domains;
export const getTopics = (state: TStateModel) => state?.questions.topics;
export const getThemes = (state: TStateModel) => state?.questions.themes;
export const getFormData = (state: TStateModel) => state?.questions.formData;
export const getQuestionsError = (state: TStateModel) => state?.questions.error;
export const getQuestionsIsLoading = (state: TStateModel) => state?.questions.loading;
