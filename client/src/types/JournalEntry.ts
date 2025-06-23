export interface JournalEntry {
  _id?: string;
  title: string;
  content: string;
  mood: string;
  category: string;
  date: string;
  userId?: string;
  wordCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
