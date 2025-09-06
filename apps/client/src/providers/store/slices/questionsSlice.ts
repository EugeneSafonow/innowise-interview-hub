import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IQuestion, IDomain, ITopic, ITheme } from '@/types/questions';

interface IQuestionsState {
  questions: IQuestion[],
  domains: IDomain[],
  topics: ITopic[],
  themes: ITheme[],
  loading: boolean,
  error: string | null,
  formData: Partial<IQuestion>,
}

const initialState: IQuestionsState = {
  questions: [],
  domains: [],
  topics: [],
  themes: [],
  loading: false,
  error: null,
  formData: {},
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<IQuestion[]>) => {
      state.questions = action.payload;
    },
    addQuestion: (state, action: PayloadAction<IQuestion>) => {
      state.questions.push(action.payload);
    },
    removeQuestion: (state, action: PayloadAction<string>) => {
      state.questions = state.questions.filter(
        question => question.id !== action.payload
      );
    },
    setDomains: (state, action: PayloadAction<IDomain[]>) => {
      state.domains = action.payload;
    },
    setTopics: (state, action: PayloadAction<ITopic[]>) => {
      state.topics = action.payload;
    },
    setThemes: (state, action: PayloadAction<ITheme[]>) => {
      state.themes = action.payload;
    },
    setFormData: (state, action: PayloadAction<Partial<IQuestion>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    clearFormData: state => {
      state.formData = {};
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setQuestions,
  addQuestion,
  removeQuestion,
  setDomains,
  setTopics,
  setThemes,
  setFormData,
  clearFormData,
  setLoading,
  setError,
} = questionsSlice.actions;

export default questionsSlice.reducer;