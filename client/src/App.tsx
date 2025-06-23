import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { RootState } from "./store/store";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import Layout from "./components/Layout";
import EntryList from "./components/Journal/EntryList";
import EntryForm from "./components/Journal/EntryForm";
import CalendarView from "./components/Calendar/CalendarView";
import SearchView from "./components/Search/SearchView";
import { JournalEntry } from "./types/JournalEntry";
import {
  useGetEntriesQuery,
  useCreateEntryMutation,
  useUpdateEntryMutation,
  useDeleteEntryMutation,
} from "./store/api/journalApi";

const AppContent: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [currentView, setCurrentView] = useState("entries");
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [showEntryForm, setShowEntryForm] = useState(false);

  const { data, isLoading } = useGetEntriesQuery(undefined, {
    skip: !isAuthenticated,
  });
  const entries: [] = data?.data || [];
  const [createEntry, { isLoading: isCreating }] = useCreateEntryMutation();
  const [updateEntry, { isLoading: isUpdating }] = useUpdateEntryMutation();
  const [deleteEntry] = useDeleteEntryMutation();

  const handleSaveEntry = async (entryData: Partial<JournalEntry>) => {
    try {
      if (editingEntry) {
        await updateEntry({ id: editingEntry._id!, entry: entryData }).unwrap();
      } else {
        await createEntry(entryData).unwrap();
      }
      setShowEntryForm(false);
      setEditingEntry(null);
    } catch (error) {
      console.error("Failed to save entry:", error);
    }
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setShowEntryForm(true);
  };

  const handleDeleteEntry = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await deleteEntry(id).unwrap();
      } catch (error) {
        console.error("Failed to delete entry:", error);
      }
    }
  };

  const handleNewEntry = () => {
    setEditingEntry(null);
    setShowEntryForm(true);
  };

  const handleCancelForm = () => {
    setShowEntryForm(false);
    setEditingEntry(null);
  };

  if (!isAuthenticated) {
    return isLoginForm ? (
      <LoginForm onToggleForm={() => setIsLoginForm(false)} />
    ) : (
      <RegisterForm onToggleForm={() => setIsLoginForm(true)} />
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "entries":
        return (
          <EntryList
            entries={entries}
            isLoading={isLoading}
            onEdit={handleEditEntry}
            onDelete={handleDeleteEntry}
          />
        );
      case "calendar":
        return (
          <CalendarView
            entries={entries}
            onDateSelect={(date) => {
              // Filter entries by date and show them
              setCurrentView("entries");
            }}
          />
        );
      case "search":
        return (
          <SearchView onEdit={handleEditEntry} onDelete={handleDeleteEntry} />
        );
      default:
        return null;
    }
  };

  return (
    <Layout
      currentView={currentView}
      onViewChange={setCurrentView}
      onNewEntry={handleNewEntry}
    >
      {renderCurrentView()}

      {showEntryForm && (
        <EntryForm
          entry={editingEntry}
          onSave={handleSaveEntry}
          onCancel={handleCancelForm}
          isLoading={isCreating || isUpdating}
        />
      )}
    </Layout>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
