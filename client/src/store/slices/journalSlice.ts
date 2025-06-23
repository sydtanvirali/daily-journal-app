import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface JournalState {
  selectedDate: string;
  searchQuery: string;
  selectedMood: string;
  selectedCategory: string;
}

const initialState: JournalState = {
  selectedDate: new Date().toISOString().split('T')[0],
  searchQuery: '',
  selectedMood: '',
  selectedCategory: '',
};

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedMood: (state, action: PayloadAction<string>) => {
      state.selectedMood = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const { setSelectedDate, setSearchQuery, setSelectedMood, setSelectedCategory } = journalSlice.actions;
export default journalSlice.reducer;